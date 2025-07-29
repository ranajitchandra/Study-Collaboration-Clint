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
            description
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
        <div className="max-w-2xl mx-auto p-6 shadow-lg bg-white rounded-lg mt-6">
            <h2 className="text-2xl font-bold mb-4">Create New Note</h2>
            <form onSubmit={handleNoteSubmit} className="space-y-4">
                <div>
                    <label className="block font-semibold mb-1">Email</label>
                    <input
                        type="email"
                        value={user?.email || ''}
                        readOnly
                        className="input input-bordered w-full"
                    />
                </div>

                <div>
                    <label className="block font-semibold mb-1">Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="input input-bordered w-full"
                        required
                    />
                </div>

                <div>
                    <label className="block font-semibold mb-1">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="textarea textarea-bordered w-full"
                        rows="5"
                        required
                    />
                </div>

                <button type="submit" className="btn btn-primary w-full">Create Note</button>
            </form>
        </div>
    );
}
