import React from 'react';

interface InitialsAvatarProps {
    name: string;
}

const colors = [
    'bg-red-500', 'bg-blue-600', 'bg-green-500', 'bg-yellow-500', 'bg-indigo-500', 'bg-purple-600', 'bg-pink-500', 'bg-teal-500'
];

const getInitials = (name: string) => {
    if (!name) return '??';
    const parts = name.split(' ');
    if (parts.length > 1 && parts[0] && parts[parts.length - 1]) {
        return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    if (name.length >= 2) {
        return name.substring(0, 2).toUpperCase();
    }
    return name.toUpperCase();
};

const InitialsAvatar: React.FC<InitialsAvatarProps> = ({ name }) => {
    const safeName = name || '';
    const initials = getInitials(safeName);
    const colorIndex = safeName.length % colors.length;
    const color = colors[colorIndex];

    return (
        <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-sm flex-shrink-0 ${color}`}>
            {initials}
        </div>
    );
};

export default InitialsAvatar;