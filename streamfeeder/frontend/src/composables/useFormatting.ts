
export function useFormatting() {
    // TODO - optionally merge a passed options with my default options?
    const formatMB = (value: number) => {
        return new Intl.NumberFormat( undefined, {style : 'unit', unit: 'megabyte', maximumSignificantDigits: 2}).format(value / 1024**2)
    };

    return {formatMB};
}

