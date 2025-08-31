import React, { useState, useEffect } from 'react';

// --- Firebase Imports ---
import { initializeApp } from 'firebase/app';
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut,
    onAuthStateChanged
} from 'firebase/auth';
import { 
    getFirestore,
    collection,
    query,
    where,
    onSnapshot,
    addDoc,
    updateDoc,
    deleteDoc,
    doc
} from 'firebase/firestore';


// --- [IMPORTANT] Firebase Configuration ---
// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBvJdzrVldl0XzxCKIKA2YktzrbnSehGUo",
  authDomain: "taskzen-hfjo2.firebaseapp.com",
  projectId: "taskzen-hfjo2",
  storageBucket: "taskzen-hfjo2.firebasestorage.app",
  messagingSenderId: "12524081585",
  appId: "1:12524081585:web:b0d88d4903115d8fdc6d90"
};

// --- Initialize Firebase ---
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


// --- SVG Icons ---
const PlusIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg> );
const CodeBracketIcon = ({ className = "w-6 h-6 mr-3 text-gray-400" }) => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75L16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" /></svg> );
const LinkIcon = ({className = "w-5 h-5 text-gray-400"}) => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" /></svg> );
const TagIcon = ({className = "w-5 h-5 text-gray-400"}) => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L9.568 3z" /><path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" /></svg> );
const ArrowLeftIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg> );
const ArrowDownTrayIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg> );
const TrashIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.067-2.09 1.02-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>);
const UserCircleIcon = ({className="w-6 h-6"}) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" /></svg>);
const ArrowRightOnRectangleIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" /></svg>);


// --- UI Components ---

const StatusIndicator = ({ status }) => {
  const baseClasses = "inline-block px-2 py-1 text-xs font-semibold rounded-full";
  if (status === 'Success') return <span className={`${baseClasses} bg-green-500/20 text-green-300`}>Success</span>;
  if (status === 'Building') return <span className={`${baseClasses} bg-yellow-500/20 text-yellow-300 animate-pulse`}>Building...</span>;
  if (status === 'Failed') return <span className={`${baseClasses} bg-red-500/20 text-red-300`}>Failed</span>;
  return <span className={`${baseClasses} bg-gray-500/20 text-gray-300`}>Queued</span>;
};

const NewProjectForm = ({ onAddProject, onCancel }) => {
    const [name, setName] = useState('');
    const [sourceUrl, setSourceUrl] = useState('');
    const [version, setVersion] = useState('1.0.0');

    const handleSubmit = (e) => {
        e.preventDefault();
        const newProjectData = {
            name: name.trim() || 'Untitled Project',
            platform: 'React Web App',
            lastBuild: 'Queued',
            sourceUrl: sourceUrl.trim() || 'https://example.com',
            version: version.trim() || '1.0.0',
            builds: []
        };
        onAddProject(newProjectData);
    };

    return (
        <div>
            <header className="mb-8"><h1 className="text-3xl font-bold tracking-tight text-white">Create a New Project</h1><p className="text-gray-400 mt-1">Fill in the details to start your first build.</p></header>
            <form onSubmit={handleSubmit} className="space-y-6"><div className="bg-gray-800/50 border border-gray-700 p-6 rounded-lg"><div className="space-y-4"><div><label htmlFor="projectName" className="block text-sm font-medium text-gray-300 mb-1">Project Name</label><div className="relative"><div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"><CodeBracketIcon className="w-5 h-5 text-gray-400" /></div><input type="text" id="projectName" value={name} onChange={e => setName(e.target.value)} className="block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm pl-10 pr-4 py-2 focus:ring-blue-500 focus:border-blue-500" placeholder="e.g., Phase 10 Scorekeeper" /></div></div><div><label htmlFor="sourceUrl" className="block text-sm font-medium text-gray-300 mb-1">Source Code URL</label><div className="relative"><div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"><LinkIcon /></div><input type="url" id="sourceUrl" value={sourceUrl} onChange={e => setSourceUrl(e.target.value)} className="block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm pl-10 pr-4 py-2 focus:ring-blue-500 focus:border-blue-500" placeholder="https://your-vibe-coding-app-url.com" /></div></div><div><label htmlFor="version" className="block text-sm font-medium text-gray-300 mb-1">Initial Version</label><div className="relative"><div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"><TagIcon /></div><input type="text" id="version" value={version} onChange={e => setVersion(e.target.value)} className="block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm pl-10 pr-4 py-2 focus:ring-blue-500 focus:border-blue-500" placeholder="1.0.0" /></div></div></div></div><div className="flex justify-end gap-4"><button type="button" onClick={onCancel} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition">Cancel</button><button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition">Create Project & Build</button></div></form>
        </div>
    );
};

const ProjectSettingsView = ({ project, onUpdate, onDelete }) => {
    const [name, setName] = useState(project.name);
    const [sourceUrl, setSourceUrl] = useState(project.sourceUrl);
    const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

    const handleUpdate = (e) => {
        e.preventDefault();
        onUpdate({ ...project, name, sourceUrl });
    };

    return (
        <div className="space-y-8">
            <form onSubmit={handleUpdate} className="bg-gray-800/50 border border-gray-700 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">General Settings</h3>
                <div className="space-y-4">
                     <div>
                        <label htmlFor="projectNameSettings" className="block text-sm font-medium text-gray-300 mb-1">Project Name</label>
                        <input type="text" id="projectNameSettings" value={name} onChange={e => setName(e.target.value)} className="block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"/>
                    </div>
                     <div>
                        <label htmlFor="sourceUrlSettings" className="block text-sm font-medium text-gray-300 mb-1">Source Code URL</label>
                        <input type="url" id="sourceUrlSettings" value={sourceUrl} onChange={e => setSourceUrl(e.target.value)} className="block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"/>
                    </div>
                </div>
                <div className="flex justify-end mt-6">
                    <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition">Save Changes</button>
                </div>
            </form>

            <div className="bg-red-900/20 border border-red-500/30 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-red-300">Danger Zone</h3>
                <p className="text-gray-400 mt-1">This action cannot be undone.</p>
                <div className="mt-4">
                    {!isConfirmingDelete ? (
                        <button onClick={() => setIsConfirmingDelete(true)} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition flex items-center">
                            <TrashIcon /> Delete this project
                        </button>
                    ) : (
                        <div className="bg-red-800/30 p-4 rounded-md">
                            <p className="font-semibold">Are you sure you want to delete this project?</p>
                            <div className="flex justify-end gap-4 mt-4">
                                <button onClick={() => setIsConfirmingDelete(false)} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition">Cancel</button>
                                <button onClick={() => onDelete(project.id)} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition">Yes, Delete</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const ProjectDetailView = ({ project, onBack, onUpdate, onDelete }) => {
    const [activeTab, setActiveTab] = useState('builds');
    
    const TabButton = ({ isActive, onClick, children }) => (
        <button onClick={onClick} className={`px-4 py-2 text-sm font-medium rounded-md transition ${isActive ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-700/50'}`}>
            {children}
        </button>
    );

    return (
        <div>
            <header className="mb-4">
                <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white transition mb-4"><ArrowLeftIcon /> Back to Dashboard</button>
                <div className="sm:flex justify-between items-center">
                    <div className="mb-4 sm:mb-0">
                        <h1 className="text-3xl font-bold tracking-tight text-white">{project.name}</h1>
                        <a href={project.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline break-all">{project.sourceUrl}</a>
                    </div>
                    {activeTab === 'builds' && (
                         <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition flex items-center gap-2 w-full sm:w-auto justify-center">Start New Build</button>
                    )}
                </div>
            </header>
            
            <nav className="mb-6 border-b border-gray-700">
                <div className="flex space-x-2">
                    <TabButton isActive={activeTab === 'builds'} onClick={() => setActiveTab('builds')}>Build History</TabButton>
                    <TabButton isActive={activeTab === 'settings'} onClick={() => setActiveTab('settings')}>Settings</TabButton>
                </div>
            </nav>

            <main>
                {activeTab === 'builds' && (
                    <div className="bg-gray-800/50 border border-gray-700 p-6 rounded-lg">
                        <h2 className="text-lg font-semibold mb-4">Build History</h2>
                        <div className="space-y-3">
                            {project.builds && project.builds.length > 0 ? (
                                project.builds.map((build, index) => (
                                    <div key={index} className="bg-gray-800 p-3 rounded-md flex justify-between items-center">
                                        <div><p className="font-semibold">Version {build.version}</p><p className="text-sm text-gray-400">{build.timestamp}</p></div>
                                        <div className="flex items-center gap-4"><StatusIndicator status={build.status} />{build.status === 'Success' && (<button className="text-gray-400 hover:text-white" title="Download .aab file"><ArrowDownTrayIcon /></button>)}</div>
                                    </div>
                                ))
                            ) : ( <p className="text-gray-400 text-center py-4">No builds yet. Start your first build!</p> )}
                        </div>
                    </div>
                )}
                {activeTab === 'settings' && <ProjectSettingsView project={project} onUpdate={onUpdate} onDelete={onDelete} />}
            </main>
        </div>
    );
};

const AccountSettingsScreen = ({ onBack }) => {
    return (
        <div>
            <header className="mb-8">
                <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white transition mb-4"><ArrowLeftIcon /> Back to Dashboard</button>
                <h1 className="text-3xl font-bold tracking-tight text-white">My Account</h1>
                <p className="text-gray-400 mt-1">Manage your account details and password.</p>
            </header>
            <main className="space-y-8">
                 <form className="bg-gray-800/50 border border-gray-700 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">Update Email</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="currentEmail">Current Email</label>
                            <input type="email" id="currentEmail" disabled value={auth.currentUser?.email || ''} className="block w-full bg-gray-700/50 border-gray-600 rounded-md shadow-sm p-2 text-gray-400" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="newEmail">New Email</label>
                            <input type="email" id="newEmail" className="block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                    </div>
                     <div className="flex justify-end mt-6">
                        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition">Save Changes</button>
                    </div>
                </form>

                 <form className="bg-gray-800/50 border border-gray-700 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">Change Password</h3>
                    <div className="space-y-4">
                         <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="currentPassword">Current Password</label>
                            <input type="password" id="currentPassword" className="block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="newPassword">New Password</label>
                            <input type="password" id="newPassword" className="block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                    </div>
                     <div className="flex justify-end mt-6">
                        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition">Update Password</button>
                    </div>
                </form>
            </main>
        </div>
    );
};

const AuthScreen = () => {
    const [isLoginView, setIsLoginView] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleAuthAction = async (e) => {
        e.preventDefault();
        setError(''); 
        try {
            if (isLoginView) {
                await signInWithEmailAndPassword(auth, email, password);
            } else {
                await createUserWithEmailAndPassword(auth, email, password);
            }
            
        } catch (err) {
            setError("Invalid email or password. Please try again.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4">
             <div className="text-center mb-8">
                <h1 className="text-4xl font-bold tracking-tight text-white">One-Click Publisher</h1>
                <p className="text-gray-400 mt-2">Your bridge to the Play Store.</p>
            </div>
            <div className="w-full max-w-md bg-gray-800/50 border border-gray-700 p-8 rounded-lg shadow-2xl">
                <h2 className="text-2xl font-bold text-center text-white mb-6">{isLoginView ? 'Log In' : 'Sign Up'}</h2>
                <form onSubmit={handleAuthAction} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="email">Email Address</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} id="email" required className="block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="password">Password</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} id="password" required className="block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500" />
                    </div>

                    {!isLoginView && (
                         <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="confirm-password">Confirm Password</label>
                            <input type="password" id="confirm-password" required className="block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                    )}

                    {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                    
                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition text-lg">{isLoginView ? 'Log In' : 'Create Account'}</button>
                </form>
                <p className="text-center text-gray-400 mt-6">
                    {isLoginView ? "Don't have an account?" : "Already have an account?"}
                    <button onClick={() => { setIsLoginView(!isLoginView); setError(''); }} className="font-semibold text-blue-400 hover:underline ml-2">
                        {isLoginView ? 'Sign Up' : 'Log In'}
                    </button>
                </p>
            </div>
        </div>
    );
};

