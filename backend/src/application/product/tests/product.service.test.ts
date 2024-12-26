import { ProductServices } from "..";
import { ProductRepository } from "../../../domain/product";

describe('ProductServices', () => {

    // createProduct successfully creates a new product with valid data
    it('should create a new product when valid data is provided', async () => {
      const mockProduct:any = {
        id: '123',
        name: 'Test Product',
        price: 100,
        stock: 10
      };
  
      const productRepository = new ProductRepository();
      jest.spyOn(productRepository, 'createProduct').mockResolvedValue(mockProduct);
  
      const productServices = new ProductServices();
      productServices['productRepository'] = productRepository;
  
      const result = await productServices.createProduct({
        name: 'Test Product',
        price: 100,
        stock: 10
      });
  
      expect(result).toEqual(mockProduct);
      expect(productRepository.createProduct).toHaveBeenCalledWith({
        data: {
          name: 'Test Product',
          price: 100,
          stock: 10
        }
      });
    });

    // createProduct returns null when product creation fails
    it('should return null when product creation fails', async () => {
      const productRepository = new ProductRepository();
      jest.spyOn(productRepository, 'createProduct').mockResolvedValue(null);
  
      const productServices = new ProductServices();
      productServices['productRepository'] = productRepository;
  
      const result = await productServices.createProduct({
        name: 'Test Product',
        price: 100,
        stock: 10
      });
  
      expect(result).toBeNull();
      expect(productRepository.createProduct).toHaveBeenCalledWith({
        data: {
          name: 'Test Product',
          price: 100,
          stock: 10
        }
      });
    });
});
