import fs from 'fs';
import __dirname from '../utils.js';
import { ProductsManagerFS } from './products.manager.FS.js';

export class CartsManagerFS {
    static #instance;

    constructor() {
        this.path = `${__dirname}/data/carts.json`;
        this.carts = [];
    }

    static getInstance() {
        if (!CartsManagerFS.#instance) {
            CartsManagerFS.#instance = new CartsManagerFS();
        }
        return CartsManagerFS.#instance;
    }

    async addCart() {
        try {
            const response = await fs.promises.readFile(this.path, 'utf-8');
            this.carts = JSON.parse(response);
            const cart = {
                id: this.carts.length !== 0 ? this.carts[this.carts.length - 1].id + 1 : 1,
                products: []
            };
            this.carts.push(cart);
            await fs.promises.writeFile(this.path, JSON.stringify(this.carts, null, '\t'));
            return cart;
        } catch (error) {
            throw error;
        }
    }

    async getCartById(id) {
        try {
            const response = await fs.promises.readFile(this.path, 'utf-8');
            this.carts = JSON.parse(response);
            const cart = this.carts.find(cart => cart.id === id);
            if (!cart) {
                throw new Error(`No se encontró el carrito con id ${id}`);
            }
            return cart;
        } catch (error) {
            throw error;
        }
    }

    async addProduct(cartId, productId) {
        try {
            const response = await fs.promises.readFile(this.path, 'utf-8');
            this.carts = JSON.parse(response);
            const cart = this.carts.find(cart => cart.id === cartId);
            if (!cart) {
                throw new Error(`No se encontró el carrito con id ${cartId}`);
            }
            await ProductsManagerFS.getInstance().getProductById(productId);
            const product = cart.products.find(product => product.productId === productId);
            if (!product) {
                cart.products.push({
                    productId: productId,
                    quantity: 1
                });
            } else {
                product.quantity++;
            }
            await fs.promises.writeFile(this.path, JSON.stringify(this.carts, null, '\t'));
            return cart;
        } catch (error) {
            throw error;
        }
    }

    async deleteProduct(cartId, productId) {
        try {
            const response = await fs.promises.readFile(this.path, 'utf-8');
            this.carts = JSON.parse(response);
            const cart = this.carts.find(cart => cart.id === cartId);
            if (!cart) {
                throw new Error(`No se encontró el carrito con id ${cartId}`);
            }
            const product = cart.products.find(product => product.productId === productId);
            if (!product) {
                throw new Error(`No se encontró el producto con id ${productId} en el carrito con id ${cartId}`);
            }
            if (product.quantity > 1) {
                product.quantity--;
            } else {
                const index = cart.products.indexOf(product);
                cart.products.splice(index, 1);
            }
            await fs.promises.writeFile(this.path, JSON.stringify(this.carts, null, '\t'));
            return cart;
        } catch (error) {
            throw error;
        }
    }
}