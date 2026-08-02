import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import sendEmail from "../utils/sendEmail.js";

// Utility Function
function calcPrices(orderItems) {
  const itemsPrice = orderItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const taxRate = 0.15;
  const taxPrice = (itemsPrice * taxRate).toFixed(2);

  const totalPrice = (
    itemsPrice +
    shippingPrice +
    parseFloat(taxPrice)
  ).toFixed(2);

  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice,
    totalPrice,
  };
}

const createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, itemsPrice: clientItemsPrice, shippingPrice: clientShippingPrice, taxPrice: clientTaxPrice, totalPrice: clientTotalPrice, currency } = req.body;

    if (orderItems && orderItems.length === 0) {
      res.status(400);
      throw new Error("No order items");
    }

    const itemsFromDB = await Product.find({
      _id: { $in: orderItems.map((x) => x._id) },
    });

    const dbOrderItems = orderItems.map((itemFromClient) => {
      const matchingItemFromDB = itemsFromDB.find(
        (itemFromDB) => itemFromDB._id.toString() === itemFromClient._id
      );

      if (!matchingItemFromDB) {
        res.status(404);
        throw new Error(`Product not found: ${itemFromClient._id}`);
      }

      return {
        ...itemFromClient,
        product: itemFromClient._id,
        price: matchingItemFromDB.price,
        _id: undefined,
      };
    });

    const { itemsPrice, taxPrice, shippingPrice, totalPrice } =
      calcPrices(dbOrderItems);

    const order = new Order({
      orderItems: dbOrderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice: clientItemsPrice || itemsPrice,
      taxPrice: clientTaxPrice || taxPrice,
      shippingPrice: clientShippingPrice || shippingPrice,
      totalPrice: clientTotalPrice || totalPrice,
      currency: currency || "USD",
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createManualOrder = async (req, res) => {
  try {
    const { productId, qty, customerName, paidAmount, currency } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    const orderItems = [{
      name: product.name,
      qty: Number(qty),
      image: product.image,
      price: Number(paidAmount) / Number(qty),
      product: product._id,
    }];

    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress: { address: "Offline Sale", city: "N/A", postalCode: "N/A", country: "N/A" },
      paymentMethod: "Cash / Offline",
      itemsPrice: paidAmount,
      taxPrice: 0,
      shippingPrice: 0,
      totalPrice: paidAmount,
      currency: currency || "USD",
      isPaid: true,
      paidAt: Date.now(),
      isDelivered: true,
      deliveredAt: Date.now(),
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate("user", "id username");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const countTotalOrders = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    res.json({ totalOrders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const calculateTotalSales = async (req, res) => {
  try {
    const orders = await Order.find();
    const totalSales = orders.reduce((sum, order) => sum + order.totalPrice, 0);
    res.json({ totalSales });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const calcualteTotalSalesByDate = async (req, res) => {
  try {
    const salesByDate = await Order.aggregate([
      {
        $match: {
          isPaid: true,
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$paidAt" },
          },
          totalSales: { $sum: "$totalPrice" },
        },
      },
    ]);

    res.json(salesByDate);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const findOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "username email"
    );

    if (order) {
      res.json(order);
    } else {
      res.status(404);
      throw new Error("Order not found");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const markOrderAsPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.payer.email_address,
      };

      const updateOrder = await order.save();
      res.status(200).json(updateOrder);
    } else {
      res.status(404);
      throw new Error("Order not found");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const markOrderAsDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404);
      throw new Error("Order not found");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const uploadPaymentProof = async (req, res) => {
  try {
    const { paymentProof } = req.body;
    const order = await Order.findById(req.params.id);

    if (order) {
      order.paymentProof = paymentProof;
      order.paymentProofStatus = "pending";
      const updatedOrder = await order.save();
      await updatedOrder.populate("user", "username email");

      // Send confirmation email to client
      sendEmail({
        to: updatedOrder.user.email,
        subject: "Payment Proof Submitted - Growth Shop",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff; color: #1a202c;">
            <div style="text-align: center; margin-bottom: 24px;">
              <h2 style="color: #dd6b20; font-size: 28px; margin: 0;">Payment Proof Submitted</h2>
              <p style="font-size: 14px; color: #718096; margin-top: 4px;">Order #${order._id}</p>
            </div>
            <div style="font-size: 16px; line-height: 1.6; margin-bottom: 24px; color: #4a5568;">
              <p>Hello <strong>${updatedOrder.user.username}</strong>,</p>
              <p>We have successfully received your payment proof for order <strong>#${order._id}</strong>. Our team is currently reviewing the payment details. Once verified, your order status will be updated immediately.</p>
              <p>Total amount: <strong>${order.totalPrice} ${order.currency}</strong></p>
            </div>
            <div style="border-top: 1px solid #e2e8f0; padding-top: 16px; font-size: 12px; color: #a0aec0; text-align: center;">
              <p>© ${new Date().getFullYear()} Growth Shop. All rights reserved.</p>
            </div>
          </div>
        `
      }).catch(err => console.error("Customer proof confirmation email failed:", err));

      // Send email alert to admin
      sendEmail({
        to: "jaygrowth01@gmail.com",
        subject: `New Payment Proof Submitted for Order #${order._id}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff; color: #1a202c;">
            <div style="text-align: center; margin-bottom: 24px;">
              <h2 style="color: #e53e3e; font-size: 28px; margin: 0;">New Payment Proof</h2>
              <p style="font-size: 14px; color: #718096; margin-top: 4px;">Awaiting Review</p>
            </div>
            <div style="font-size: 16px; line-height: 1.6; margin-bottom: 24px; color: #4a5568;">
              <p>A new payment proof has been submitted by user <strong>${updatedOrder.user.username}</strong> (${updatedOrder.user.email}) for order <strong>#${order._id}</strong>.</p>
              <p>Total Amount: <strong>${order.totalPrice} ${order.currency}</strong></p>
              <p>Please log in to the admin panel to evaluate the payment proof.</p>
            </div>
            <div style="text-align: center; margin-bottom: 24px;">
              <a href="https://growthsstore.com/admin/paymentproofs" style="display: inline-block; background-color: #e53e3e; color: #ffffff; text-decoration: none; padding: 12px 24px; font-weight: bold; border-radius: 6px;">Evaluate Proof</a>
            </div>
          </div>
        `
      }).catch(err => console.error("Admin proof alert email failed:", err));

      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const approvePaymentProof = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentProofStatus = "approved";
      const updatedOrder = await order.save();
      await updatedOrder.populate("user", "username email");

      // Send approval email to client
      sendEmail({
        to: updatedOrder.user.email,
        subject: "Your Payment Has Been Approved!",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff; color: #1a202c;">
            <div style="text-align: center; margin-bottom: 24px;">
              <h2 style="color: #38a169; font-size: 28px; margin: 0;">Payment Approved!</h2>
              <p style="font-size: 14px; color: #718096; margin-top: 4px;">Order #${order._id}</p>
            </div>
            <div style="font-size: 16px; line-height: 1.6; margin-bottom: 24px; color: #4a5568;">
              <p>Hello <strong>${updatedOrder.user.username}</strong>,</p>
              <p>We are pleased to inform you that your payment for order <strong>#${order._id}</strong> has been approved. Your order is now marked as paid and will be processed immediately.</p>
              <p>You can also chat directly with the admin for further updates and next steps.</p>
            </div>
            <div style="text-align: center; margin-bottom: 24px;">
              <a href="https://growthsstore.com/messages" style="display: inline-block; background-color: #38a169; color: #ffffff; text-decoration: none; padding: 12px 24px; font-weight: bold; border-radius: 6px;">Go to Chat</a>
            </div>
            <div style="border-top: 1px solid #e2e8f0; padding-top: 16px; font-size: 12px; color: #a0aec0; text-align: center;">
              <p>© ${new Date().getFullYear()} Growth Shop. All rights reserved.</p>
            </div>
          </div>
        `
      }).catch(err => console.error("Approval email failed:", err));

      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const rejectPaymentProof = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isPaid = false;
      order.paymentProofStatus = "rejected";
      const updatedOrder = await order.save();
      await updatedOrder.populate("user", "username email");

      // Send rejection email to client
      sendEmail({
        to: updatedOrder.user.email,
        subject: "Payment Proof Rejected - Growth Shop",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff; color: #1a202c;">
            <div style="text-align: center; margin-bottom: 24px;">
              <h2 style="color: #e53e3e; font-size: 28px; margin: 0;">Payment Proof Rejected</h2>
              <p style="font-size: 14px; color: #718096; margin-top: 4px;">Order #${order._id}</p>
            </div>
            <div style="font-size: 16px; line-height: 1.6; margin-bottom: 24px; color: #4a5568;">
              <p>Hello <strong>${updatedOrder.user.username}</strong>,</p>
              <p>We regret to inform you that your payment proof for order <strong>#${order._id}</strong> has been rejected by the admin. Please ensure that the screenshot or file submitted represents a successful payment transaction matching the order total.</p>
              <p>If you have already paid, you can appeal this rejection directly from your order page by explaining the issue and resubmitting details.</p>
            </div>
            <div style="text-align: center; margin-bottom: 24px;">
              <a href="https://growthsstore.com/order/${order._id}" style="display: inline-block; background-color: #e53e3e; color: #ffffff; text-decoration: none; padding: 12px 24px; font-weight: bold; border-radius: 6px;">View Order & Appeal</a>
            </div>
            <div style="border-top: 1px solid #e2e8f0; padding-top: 16px; font-size: 12px; color: #a0aec0; text-align: center;">
              <p>© ${new Date().getFullYear()} Growth Shop. All rights reserved.</p>
            </div>
          </div>
        `
      }).catch(err => console.error("Rejection email failed:", err));

      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const appealPaymentProof = async (req, res) => {
  try {
    const { appealText } = req.body;
    const order = await Order.findById(req.params.id);

    if (order) {
      order.paymentProofStatus = "appealed";
      order.paymentAppealText = appealText;
      const updatedOrder = await order.save();
      await updatedOrder.populate("user", "username email");

      // Send appeal email to admin
      sendEmail({
        to: "jaygrowth01@gmail.com",
        subject: `New Payment Appeal for Order #${order._id}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff; color: #1a202c;">
            <div style="text-align: center; margin-bottom: 24px;">
              <h2 style="color: #dd6b20; font-size: 28px; margin: 0;">Payment Rejection Appeal</h2>
              <p style="font-size: 14px; color: #718096; margin-top: 4px;">Order #${order._id}</p>
            </div>
            <div style="font-size: 16px; line-height: 1.6; margin-bottom: 24px; color: #4a5568;">
              <p>User <strong>${updatedOrder.user.username}</strong> (${updatedOrder.user.email}) has appealed a payment rejection for order <strong>#${order._id}</strong>.</p>
              <p><strong>Customer Appeal Message:</strong></p>
              <blockquote style="border-left: 4px solid #dd6b20; padding-left: 16px; font-style: italic; color: #4a5568; margin: 16px 0;">
                "${appealText}"
              </blockquote>
              <p>Please check the payment proof details in the admin portal.</p>
            </div>
            <div style="text-align: center; margin-bottom: 24px;">
              <a href="https://growthsstore.com/admin/paymentproofs" style="display: inline-block; background-color: #dd6b20; color: #ffffff; text-decoration: none; padding: 12px 24px; font-weight: bold; border-radius: 6px;">Evaluate Appeal</a>
            </div>
          </div>
        `
      }).catch(err => console.error("Appeal email sending failed:", err));

      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      await Order.deleteOne({ _id: order._id });
      res.json({ message: "Order deleted successfully" });
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteAllOrders = async (req, res) => {
  try {
    await Order.deleteMany({});
    res.json({ message: "All orders and sales history reset successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export {
  createOrder,
  getAllOrders,
  getUserOrders,
  countTotalOrders,
  calculateTotalSales,
  calcualteTotalSalesByDate,
  findOrderById,
  markOrderAsPaid,
  markOrderAsDelivered,
  createManualOrder,
  uploadPaymentProof,
  approvePaymentProof,
  rejectPaymentProof,
  appealPaymentProof,
  deleteOrder,
  deleteAllOrders,
};
