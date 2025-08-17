import { useContext, useState } from 'react';
import Swal from 'sweetalert2';
import { AuthContext } from '../../../context/AuthContextProvider';
import useAxiosSecureApi from '../../../hooks/useAxiosSecureApi';
import { useNavigate } from 'react-router';

export default function CreateNote() {
    const { user } = useContext(AuthContext);
    const axiosSecure = useAxiosSecureApi();
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleNoteSubmit = async (e) => {
        e.preventDefault();

        const note = {
            email: user?.email,
            title,
            description,
        };

        try {
            const res = await axiosSecure.post('/notes', note);
            if (res.data.insertedId) {
                Swal.fire('Success', 'Note created successfully!', 'success');
                setTitle('');
                setDescription('');
                navigate('/dashboard/notes');
            }
        } catch (error) {
            Swal.fire('Error', 'Failed to create note', 'error');
        }
    };

    return (
        <div className="max-w-2xl mx-auto mt-12 px-4">
            <div className="card bg-base-100 shadow-lg border border-base-200 rounded-2xl">
                <div className="card-body">
                    {/* Title */}
                    <h2 className="text-3xl font-extrabold text-base-content text-center mb-6">
                        Create New Note
                    </h2>

                    {/* Form */}
                    <form onSubmit={handleNoteSubmit} className="space-y-6">
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-semibold text-base-content mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                value={user?.email || ''}
                                readOnly
                                className="input input-bordered w-full bg-base-200 text-base-content font-medium cursor-not-allowed"
                            />
                        </div>

                        {/* Note Title */}
                        <div>
                            <label className="block text-sm font-semibold text-base-content mb-2">
                                Title
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary/40"
                                placeholder="Enter note title"
                                required
                            />
                        </div>

                        {/* Note Description */}
                        <div>
                            <label className="block text-sm font-semibold text-base-content mb-2">
                                Description
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="textarea textarea-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary/40"
                                placeholder="Write your note here..."
                                rows="6"
                                required
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="btn btn-primary w-full rounded-xl text-lg font-semibold shadow-md hover:shadow-lg transition-all"
                        >
                            Create Note
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
