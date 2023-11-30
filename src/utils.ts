export default class Utils {
    // Calculate the max price by giving a list of currency values
    static async maxPrice(arrayOfPrices: Promise<string[]>) {
        let prices: number[] = [];
    
        (await arrayOfPrices).forEach(pricetext => {
            let price = parseFloat(pricetext.replace(/[A$,]+/g, ''))
            prices.push(price)
        });

        let maxPriceIndex = 0;
        let index = 0;
        let maxPrice = 0;
        prices.forEach( price => {
            if (price > maxPrice) {
                maxPrice = price;
                maxPriceIndex = index;
            }
            index++;
        });


        return (await arrayOfPrices).at(maxPriceIndex);
    }
}