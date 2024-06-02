import { faker } from "@faker-js/faker";

export const createRandomProduct = () => {

    return {

        _id: faker.database.mongodbObjectId(),
        productTitle: faker.commerce.product(),
        productDescription: faker.commerce.productDescription(),
        productStock: faker.number.int(),
        productCategory: faker.commerce.department(),
        productStatus: faker.datatype.boolean(0.9),
        productCode: faker.commerce.uuid(),
        //otra opcion:  faker.string.alphanumeric(10),
        productPrice: faker.commerce.price(),
    }
}

