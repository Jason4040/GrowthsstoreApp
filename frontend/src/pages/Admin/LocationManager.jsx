import { useState } from "react";
import { Pencil } from "lucide-react";
import { toast } from "react-toastify";
import {
  useGetLocationsQuery,
  useCreateLocationMutation,
  useUpdateLocationMutation,
  useDeleteLocationMutation,
} from "../../redux/api/locationApiSlice";
import { LOCATION_LEVELS, SHIPPING_COUNTRIES } from "../../Utils/locationLevels";
import CategoryForm from "../../components/CategoryForm";
import Modal from "../../components/Modal";

const LocationColumn = ({ title, items, isLoading, selectedId, onSelect, onCreate, onEdit, disabled, disabledHint }) => {
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }
    onCreate(name.trim());
    setName("");
  };

  return (
    <div className="bg-gray-50 dark:bg-[#101010] p-5 rounded-xl border border-gray-200 dark:border-gray-800 flex-1 min-w-[240px]">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-4">{title}</h3>

      {disabled ? (
        <p className="text-xs text-gray-500 italic mb-4">{disabledHint}</p>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
          <input
            type="text"
            className="flex-1 p-2.5 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-orange-500"
            placeholder={`Add ${title.toLowerCase()}`}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button className="bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium px-4 rounded-lg transition-colors">
            Add
          </button>
        </form>
      )}

      {isLoading ? (
        <p className="text-sm text-gray-500">Loading...</p>
      ) : (
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {items?.length === 0 && <p className="text-sm text-gray-500 italic">None yet.</p>}
          {items?.map((item) => (
            <div
              key={item._id}
              onClick={() => onSelect(item)}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg border cursor-pointer transition-all ${
                selectedId === item._id
                  ? "bg-orange-600/10 border-orange-500 text-orange-600 dark:text-orange-400"
                  : "bg-white dark:bg-black/30 border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-400"
              }`}
            >
              <span className="text-sm">{item.name}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(item);
                }}
                className="text-gray-500 hover:text-orange-500 transition-colors shrink-0 ml-2"
              >
                <Pencil size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const LocationManager = () => {
  const [country, setCountry] = useState(SHIPPING_COUNTRIES[0]);
  const [selectedL1, setSelectedL1] = useState(null);
  const [selectedL2, setSelectedL2] = useState(null);
  const [editingLocation, setEditingLocation] = useState(null);
  const [editingName, setEditingName] = useState("");

  const levels = LOCATION_LEVELS[country];

  const { data: level1Items, isLoading: loadingL1 } = useGetLocationsQuery({ country, level: 0 });
  const { data: level2Items, isLoading: loadingL2 } = useGetLocationsQuery(
    { country, level: 1, parent: selectedL1?._id },
    { skip: !selectedL1 }
  );
  const { data: level3Items, isLoading: loadingL3 } = useGetLocationsQuery(
    { country, level: 2, parent: selectedL2?._id },
    { skip: !selectedL2 }
  );

  const [createLocation] = useCreateLocationMutation();
  const [updateLocation] = useUpdateLocationMutation();
  const [deleteLocation] = useDeleteLocationMutation();

  const handleCountryChange = (next) => {
    setCountry(next);
    setSelectedL1(null);
    setSelectedL2(null);
  };

  const handleCreate = async (level, parent, name) => {
    try {
      const result = await createLocation({ name, country, level, parent }).unwrap();
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`${result.name} added`);
      }
    } catch (error) {
      toast.error("Failed to add location");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingName.trim()) {
      toast.error("Name is required");
      return;
    }
    try {
      const result = await updateLocation({ locationId: editingLocation._id, name: editingName.trim() }).unwrap();
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Updated");
        setEditingLocation(null);
      }
    } catch (error) {
      toast.error("Failed to update location");
    }
  };

  const handleDelete = async () => {
    try {
      const result = await deleteLocation(editingLocation._id).unwrap();
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Deleted");
        if (selectedL1?._id === editingLocation._id) setSelectedL1(null);
        if (selectedL2?._id === editingLocation._id) setSelectedL2(null);
        setEditingLocation(null);
      }
    } catch (error) {
      toast.error("Failed to delete location");
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="w-full bg-gray-100 dark:bg-[#151515] p-6 md:p-10 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl">
        <h1 className="text-3xl font-semibold mb-2 text-gray-900 dark:text-white">Manage Shipping Locations</h1>
        <p className="text-sm text-gray-500 mb-8">
          Build the location tree customers pick from at checkout. Nothing here is hardcoded — add, rename, or remove entries as needed.
        </p>

        <div className="flex gap-2 mb-8">
          {SHIPPING_COUNTRIES.map((c) => (
            <button
              key={c}
              onClick={() => handleCountryChange(c)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                country === c
                  ? "bg-orange-600 text-white"
                  : "bg-gray-50 dark:bg-[#101010] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800 hover:border-gray-400"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <LocationColumn
            title={levels[0]}
            items={level1Items}
            isLoading={loadingL1}
            selectedId={selectedL1?._id}
            onSelect={(item) => {
              setSelectedL1(item);
              setSelectedL2(null);
            }}
            onCreate={(name) => handleCreate(0, null, name)}
            onEdit={(item) => {
              setEditingLocation(item);
              setEditingName(item.name);
            }}
          />
          <LocationColumn
            title={levels[1]}
            items={level2Items}
            isLoading={loadingL2}
            selectedId={selectedL2?._id}
            onSelect={(item) => setSelectedL2(item)}
            onCreate={(name) => handleCreate(1, selectedL1._id, name)}
            onEdit={(item) => {
              setEditingLocation(item);
              setEditingName(item.name);
            }}
            disabled={!selectedL1}
            disabledHint={`Select a ${levels[0]} first.`}
          />
          <LocationColumn
            title={levels[2]}
            items={level3Items}
            isLoading={loadingL3}
            selectedId={null}
            onSelect={() => {}}
            onCreate={(name) => handleCreate(2, selectedL2._id, name)}
            onEdit={(item) => {
              setEditingLocation(item);
              setEditingName(item.name);
            }}
            disabled={!selectedL2}
            disabledHint={`Select a ${levels[1]} first.`}
          />
        </div>

        <Modal isOpen={!!editingLocation} onClose={() => setEditingLocation(null)}>
          <div className="p-2">
            <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">Edit Location</h2>
            <CategoryForm
              value={editingName}
              setValue={setEditingName}
              handleSubmit={handleUpdate}
              buttonText="Save"
              handleDelete={handleDelete}
            />
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default LocationManager;
