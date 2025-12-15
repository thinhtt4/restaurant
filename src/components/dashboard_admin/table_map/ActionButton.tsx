interface ActionButtonProps {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
    disabled?: boolean;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
    icon,
    label,
    onClick,
    variant = 'primary',
    disabled = false
}) => {
    const variants = {
        primary: 'bg-blue-500 hover:bg-blue-600 text-white',
        success: 'bg-green-500 hover:bg-green-600 text-white',
        warning: 'bg-yellow-500 hover:bg-yellow-600 text-white',
        danger: 'bg-red-500 hover:bg-red-600 text-white',
        info: 'bg-purple-500 hover:bg-purple-600 text-white',
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`flex flex-col items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]}`}
        >
            {icon}
            <span className="text-sm">{label}</span>
        </button>
    );
};