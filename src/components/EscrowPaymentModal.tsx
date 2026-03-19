import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LockKey, ShieldCheck, SpinnerGap, CreditCard, CreditCardIcon } from "@phosphor-icons/react";
import { Separator } from "@/components/ui/separator";

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

    const handleDeposit = () => {
        setIsProcessing(true);
        // Simulate API call and payment processing
        setTimeout(() => {
            setIsProcessing(false);
            onSuccess();
        }, 2000);
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !isProcessing && !open && onClose()}>
            <DialogContent className="max-w-4xl p-0 overflow-hidden bg-white border-0 shadow-2xl rounded-2xl">
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

                                <div className="pt-4">
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
            </DialogContent>
        </Dialog>
    );
}
