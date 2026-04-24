export const loadRazorpay = (keyId?: string): Promise<any> => {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => {
            const Razorpay = (window as any).Razorpay;
            resolve({
                open: (options: any) => {
                    const rzp = new Razorpay(options);
                    rzp.open();
                }
            });
        };
        script.onerror = () => {
            resolve(null);
        };
        document.body.appendChild(script);
    });
};
