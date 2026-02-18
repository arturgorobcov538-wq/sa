
export function getNetworkAddress(ip: string, mask: string): string {
    const ipOctets = ip.split('.');
    const maskOctets = mask.split('.');
    const result: number[] = [];

    for (let i = 0; i < 4; i++) {
        const ipNum = parseInt(ipOctets[i]) || 0;
        const maskNum = parseInt(maskOctets[i]) || 0;
        result.push(ipNum & maskNum);
    }

    return `${result[0]}.${result[1]}.${result[2]}.${result[3]}`;
}

export function getAddressesCount(mask: string): number {
    let binaryMask = '';

    for (const octet of mask.split('.')) {
        const num = parseInt(octet) || 0;
        binaryMask += num.toString(2).padStart(8, '0');
    }

    const onesCount = binaryMask.split('1').length - 1;
    const zeros = 32 - onesCount;

    if (zeros === 0) return 1;
    if (zeros === 1) return 2;

    return Math.pow(2, zeros) - 2;
}

export function getBroadcastAddress(networkAddress: string, mask: string): string {
    const networkOctets = networkAddress.split('.');
    const maskOctets = mask.split('.');
    const result: number[] = [];

    for (let i = 0; i < 4; i++) {
        const networkOctet = parseInt(networkOctets[i]) || 0;
        const maskOctet = parseInt(maskOctets[i]) || 0;
        const invertedMaskOctet = 255 - maskOctet;
        result.push(networkOctet + invertedMaskOctet);
    }

    return `${result[0]}.${result[1]}.${result[2]}.${result[3]}`;
}

export function getFirstUsableAddress(networkAddress: string, mask: string): string {
    const networkOctets = networkAddress.split('.');

    if (mask === '255.255.255.255') {
        return networkAddress;
    }

    const lastOctet = parseInt(networkOctets[3]) || 0;
    networkOctets[3] = (lastOctet + 1).toString();

    return networkOctets.join('.');
}

export function getLastUsableAddress(broadcastAddress: string, mask: string): string {
    const broadcastOctets = broadcastAddress.split('.');

    if (mask === '255.255.255.255') {
        return broadcastAddress;
    }

    if (mask === '255.255.255.254') {
        return broadcastAddress;
    }

    const lastOctet = parseInt(broadcastOctets[3]) || 0;
    broadcastOctets[3] = (lastOctet - 1).toString();

    return broadcastOctets.join('.');
}