import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LockKey, ShieldCheck, SpinnerGap, CreditCard, CreditCardIcon, CheckCircle, Receipt, ArrowRight, Copy } from "@phosphor-icons/react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface EscrowPaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    project: {
        title: string;
        budget: number;
    };
    application: {
        student_name: string;
        student_id: string;
    };
    onSuccess: () => void;
}

export function EscrowPaymentModal({
    isOpen,
    onClose,
    project,
    application,
    onSuccess,
}: EscrowPaymentModalProps) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const transactionId = useMemo(() => 
        `TXN-SB-${Math.random().toString(36).substring(2, 7).toUpperCase()}${Math.floor(1000 + Math.random() * 9000)}`,
    []);

    const handleDeposit = () => {
        setIsProcessing(true);
        // Simulate API call and payment processing
        setTimeout(() => {
            setIsProcessing(false);
            setShowSuccess(true);
            // Trigger parent success after a short delay to allow viewing the dialog
            setTimeout(() => {
                onSuccess();
            }, 5000);
        }, 2000);
    };

    const handleClose = () => {
        setShowSuccess(false);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !isProcessing && !open && handleClose()}>
            <DialogContent className={cn(
                "p-0 overflow-hidden bg-white border-0 shadow-2xl rounded-2xl transition-all duration-500",
                showSuccess ? "max-w-[480px]" : "max-w-4xl"
            )}>
                {showSuccess ? (
                    <div className="flex flex-col items-center justify-center p-8 md:p-12 text-center animate-in fade-in zoom-in duration-500">
                        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6 relative">
                            <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-20"></div>
                            <CheckCircle className="w-12 h-12 text-green-600 relative z-10" weight="fill" />
                        </div>
                        
                        <div className="space-y-1 mb-6">
                            <h2 className="text-2xl font-bold text-slate-900">Payment Confirmed</h2>
                            <p className="text-slate-500">Funds are now secured in Escrow</p>
                        </div>

                        <div className="w-full bg-slate-50 rounded-2xl border border-slate-200 p-5 mb-8 text-left space-y-4">
                            <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 bg-white border border-slate-200 rounded-lg flex items-center justify-center">
                                        <Receipt className="w-4 h-4 text-slate-400" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Transaction ID</p>
                                        <p className="text-sm font-mono font-medium text-slate-700">{transactionId}</p>
                                    </div>
                                </div>
                                <button type="button" className="text-blue-600 hover:text-blue-700 p-1">
                                    <Copy className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-0.5">Project</p>
                                    <p className="text-sm font-medium text-slate-800 line-clamp-1">{project.title}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-0.5">Student</p>
                                    <p className="text-sm font-medium text-slate-800">{application.student_name}</p>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Amount deposited to escrow</span>
                                <span className="text-xl font-bold text-green-600">£{project.budget.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 w-full">
                            <Button 
                                onClick={handleClose}
                                className="flex-1 h-11 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-medium"
                            >
                                Go to Dashboard
                            </Button>
                            <Button 
                                variant="outline"
                                className="flex-1 h-11 rounded-xl border-slate-200 text-slate-600 font-medium"
                            >
                                View Contract
                            </Button>
                        </div>
                        
                        <p className="mt-8 text-xs text-slate-400 flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" weight="fill" />
                            SkillBridge Escrow Protection Active
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col md:flex-row h-full">

                    {/* Left panel: Order Summary */}
                    <div className="md:w-5/12 bg-slate-50 p-8 border-r border-slate-200/60 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-8">
                                <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                    <ShieldCheck className="w-5 h-5 text-white" weight="fill" />
                                </div>
                                <span className="font-semibold text-lg tracking-tight text-slate-900">Secure Escrow</span>
                            </div>

                            <h3 className="text-slate-500 text-sm font-medium uppercase tracking-wider mb-2">Payment Summary</h3>
                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-medium text-slate-900 line-clamp-2">{project.title}</h4>
                                    <p className="text-slate-500 text-sm mt-1">Student: {application.student_name}</p>
                                </div>

                                <Separator className="bg-slate-200" />

                                <div className="flex items-center justify-between">
                                    <span className="text-slate-600">Subtotal</span>
                                    <span className="font-medium text-slate-900">£{project.budget.toFixed(2)}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-600">Platform Fee</span>
                                    <span className="font-medium text-slate-900">£0.00</span>
                                </div>

                                <Separator className="bg-slate-200" />

                                <div className="flex items-center justify-between pt-2">
                                    <span className="font-semibold text-slate-900">Total Due</span>
                                    <span className="font-bold text-2xl text-slate-900">£{project.budget.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 bg-blue-50/50 p-4 rounded-xl border border-blue-100/50">
                            <div className="flex items-start gap-3">
                                <LockKey className="w-5 h-5 text-blue-600 mt-0.5" />
                                <p className="text-sm text-blue-800 leading-relaxed">
                                    <span className="font-semibold block mb-1">Funds held securely</span>
                                    Your payment will be held in our secure escrow vault. It will only be released to the freelancer once you approve the final deliverable.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right panel: Payment Form */}
                    <div className="md:w-7/12 p-8 md:p-10 bg-white flex flex-col">
                        <DialogHeader className="mb-8">
                            <DialogTitle className="text-2xl font-semibold tracking-tight">Payment Details</DialogTitle>
                            <DialogDescription className="text-slate-500">
                                Complete your deposit to start the project. This is a secure, encrypted transaction.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="flex-1">
                            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleDeposit(); }}>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-slate-700 font-medium">Billing Address</Label>
                                        <Input id="email" type="email" placeholder="you@company.com" defaultValue="employer@example.com" className="h-11 rounded-xl" required disabled={isProcessing} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="card-number" className="text-slate-700 font-medium">Card Information</Label>
                                        <div className="relative">
                                            <CreditCardIcon className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                            <Input
                                                id="card-number"
                                                placeholder="0000 0000 0000 0000"
                                                className="h-11 pl-10 rounded-xl"
                                                defaultValue="4242 4242 4242 4242"
                                                required
                                                disabled={isProcessing}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="expiry" className="text-slate-700 font-medium">Expiry</Label>
                                            <Input id="expiry" placeholder="MM/YY" className="h-11 rounded-xl" defaultValue="12/28" required disabled={isProcessing} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="cvc" className="text-slate-700 font-medium">CVC</Label>
                                            <Input id="cvc" placeholder="123" type="password" maxLength={4} className="h-11 rounded-xl" defaultValue="123" required disabled={isProcessing} />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="name" className="text-slate-700 font-medium">Name on Card</Label>
                                        <Input id="name" placeholder="John Doe" className="h-11 rounded-xl" defaultValue="John Doe" required disabled={isProcessing} />
                                    </div>
                                </div>

                                <div className="pt-4 space-y-3">
                                    <Button
                                        type="submit"
                                        className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium text-base rounded-xl transition-all shadow-sm hover:shadow-md disabled:opacity-80 disabled:cursor-not-allowed"
                                        disabled={isProcessing}
                                    >
                                        {isProcessing ? (
                                            <>
                                                <SpinnerGap className="w-5 h-5 mr-2 animate-spin" weight="bold" />
                                                Processing securely...
                                            </>
                                        ) : (
                                            `Deposit £${project.budget.toFixed(2)} to Escrow`
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
