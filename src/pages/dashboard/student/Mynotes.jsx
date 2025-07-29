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
            <h2 className="text-2xl font-bold mb-4">My Notes</h2>

            {notes.length === 0 ? (
                <p className="text-gray-500">No notes found.</p>
            ) : (
                <>
                    {notes.map(note => (
                        <div key={note._id} className="bg-white p-4 rounded shadow mb-4">
                            {editingNote && editingNote._id === note._id ? (
                                <form onSubmit={handleUpdate}>
                                    <input
                                        type="text"
                                        value={editingNote.title}
                                        onChange={(e) =>
                                            setEditingNote({ ...editingNote, title: e.target.value })
                                        }
                                        className="input input-bordered w-full mb-2"
                                        required
                                    />
                                    <textarea
                                        value={editingNote.description}
                                        onChange={(e) =>
                                            setEditingNote({ ...editingNote, description: e.target.value })
                                        }
                                        className="textarea textarea-bordered w-full mb-2"
                                        rows={4}
                                        required
                                    />
                                    <button className="btn btn-primary mr-2" type="submit">Save</button>
                                    <button
                                        className="btn"
                                        type="button"
                                        onClick={() => setEditingNote(null)}
                                    >
                                        Cancel
                                    </button>
                                </form>
                            ) : (
                                <>
                                    <h3 className="font-bold text-lg">{note.title}</h3>
                                    <p className="text-gray-700 mb-2">{note.description}</p>
                                    <button
                                        className="btn btn-sm btn-outline mr-2"
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
                                </>
                            )}
                        </div>
                    ))}
                </>
            )}
        </div>
    );
}
