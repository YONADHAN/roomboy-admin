import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isLoading?: boolean;
    variant?: 'danger' | 'warning' | 'info';
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    isLoading = false,
    variant = 'danger'
}) => {
    // Handle Escape key to close
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            window.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        }

        return () => {
            window.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const getIcon = () => {
        switch (variant) {
            case 'danger':
                return <AlertTriangle className="h-6 w-6 text-red-600" />;
            case 'warning':
                return <AlertTriangle className="h-6 w-6 text-orange-600" />;
            default:
                return <AlertTriangle className="h-6 w-6 text-blue-600" />;
        }
    };

    const getConfirmButtonClasses = () => {
        switch (variant) {
            case 'danger':
                return "bg-red-600 hover:bg-red-700 text-white border-none";
            case 'warning':
                return "bg-orange-600 hover:bg-orange-700 text-white border-none";
            default:
                return "bg-blue-600 hover:bg-blue-700 text-white border-none";
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={isLoading ? undefined : onClose}
                aria-hidden="true"
            />

            {/* Modal Dialog */}
            <div className="relative bg-white dark:bg-neutral-900 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full border border-slate-200 dark:border-neutral-800">
                <div className="bg-white dark:bg-neutral-900 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                        <div className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10 ${variant === 'danger' ? 'bg-red-100 dark:bg-red-900/20' :
                                variant === 'warning' ? 'bg-orange-100 dark:bg-orange-900/20' :
                                    'bg-blue-100 dark:bg-blue-900/20'
                            }`}>
                            {getIcon()}
                        </div>
                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                            <h3 className="text-lg leading-6 font-medium text-slate-900 dark:text-neutral-100" id="modal-title">
                                {title}
                            </h3>
                            <div className="mt-2">
                                <p className="text-sm text-slate-500 dark:text-neutral-400">
                                    {message}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            disabled={isLoading}
                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-500 dark:hover:text-neutral-300 focus:outline-none"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>
                <div className="bg-slate-50 dark:bg-neutral-950 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-2">
                    <Button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={`${getConfirmButtonClasses()} w-full sm:w-auto sm:text-sm`}
                    >
                        {isLoading ? 'Processing...' : confirmText}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={isLoading}
                        className="mt-3 w-full sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm bg-white dark:bg-neutral-900 hover:bg-slate-50 dark:hover:bg-neutral-800 border-slate-300 dark:border-neutral-700 text-slate-700 dark:text-neutral-300"
                    >
                        {cancelText}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
