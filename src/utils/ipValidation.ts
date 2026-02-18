export function isIpValid(ip: string): boolean {
    const regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;

    if (!regex.test(ip)) {
        return false;
    }

    const octets = ip.split('.');
    for (const octet of octets) {
        const num = Number(octet);
        if (num < 0 || num > 255 || isNaN(num)) {
            return false;
        }
    }

    return true;
}