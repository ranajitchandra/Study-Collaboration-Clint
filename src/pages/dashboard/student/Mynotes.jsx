import { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { AuthContext } from "../../../context/AuthContextProvider";
import useAxiosSecureApi from "../../../hooks/useAxiosSecureApi";

export default function MyNotes() {
    const { user } = useContext(AuthContext);
    const axiosSecure = useAxiosSecureApi();
    const [notes, setNotes] = useState([]);
    const [editingNote, setEditingNote] = useState(null);

    const fetchNotes = async () => {
        const res = await axiosSecure.get(`/notes?email=${user?.email}`);
        setNotes(res.data);
    };

    useEffect(() => {
        if (user?.email) fetchNotes();
    }, [user]);

    const handleDelete = async (id) => {
        const confirm = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
        });

        if (confirm.isConfirmed) {
            await axiosSecure.delete(`/notes/${id}`);
            Swal.fire("Deleted!", "Your note has been deleted.", "success");
            fetchNotes();
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        await axiosSecure.put(`/notes/${editingNote._id}`, {
            title: editingNote.title,
            description: editingNote.description,
        });

        Swal.fire("Success", "Note updated!", "success");
        setEditingNote(null);
        fetchNotes();
    };

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h2 className="text-3xl font-extrabold text-base-content mb-6 text-center">
                📝 My Notes
            </h2>

            {notes.length === 0 ? (
                <p className="text-gray-500 text-center mt-8">No notes found.</p>
            ) : (
                <div className="space-y-4">
                    {notes.map((note) => (
                        <div
                            key={note._id}
                            className="bg-base-100 border border-base-200 shadow-lg rounded-xl p-4"
                        >
                            {editingNote && editingNote._id === note._id ? (
                                <form onSubmit={handleUpdate} className="space-y-3">
                                    <input
                                        type="text"
                                        value={editingNote.title}
                                        onChange={(e) =>
                                            setEditingNote({ ...editingNote, title: e.target.value })
                                        }
                                        className="input input-bordered w-full focus:ring-2 focus:ring-primary/40"
                                        required
                                    />
                                    <textarea
                                        value={editingNote.description}
                                        onChange={(e) =>
                                            setEditingNote({ ...editingNote, description: e.target.value })
                                        }
                                        className="textarea textarea-bordered w-full focus:ring-2 focus:ring-primary/40"
                                        rows={4}
                                        required
                                    />
                                    <div className="flex gap-2">
                                        <button className="btn btn-primary flex-1" type="submit">
                                            Save
                                        </button>
                                        <button
                                            className="btn flex-1"
                                            type="button"
                                            onClick={() => setEditingNote(null)}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <>
                                    <h3 className="font-bold text-lg text-base-content">{note.title}</h3>
                                    <p className="text-base-content/80 mb-3">{note.description}</p>
                                    <div className="flex justify-items-start gap-2">
                                        <button
                                            className="btn btn-sm btn-outline"
                                            onClick={() => setEditingNote(note)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-sm btn-error text-white"
                                            onClick={() => handleDelete(note._id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
