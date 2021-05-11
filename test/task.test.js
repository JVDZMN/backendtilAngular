let chai = require('chai');
let chaiHttp = require('chai-http')
let server = require('../app');

//Assertion
chai.should();

chai.use(chaiHttp);

describe('Products Api', () => {
    /**
     * Test the GET route
     */
    describe('GET /api/products', () => {
        it('it should GET all the products ', (done) => {
            chai.request(server)
                .get('/api/products')
                .end((err, response) => {
                    response.should.have.status(200);
                    done();

                })
        });
    });

    /**
     * Test the POST route
     */
    describe('POST /api/products', () => {
        it('it should POST a new product ', (done) => {
            const product = {
                name: 'Nike',
                description: 'NikeBLUE',
                richDescription: 'ItisaTest',
                image: 'https://img.ltwebstatic.com/images3_pi/2019/11/15/15738237944de4e21410c3dd56554191f6d977e0fc_thumbnail_600x.webp',
                brand: 'Adidas',
                price: 220,
                countInStock: 4
            };
            chai.request(server)
                .post('/api/products')
                .send(product)
                .end((err, response) => {
                    response.should.have.status(500);
                    done();
                });
        });
    });

    /**
     * Test the PUT route
     */
    describe('POST /api/products/:id', () => {
        it('it should PUT a product ', (done) => {
            const productID = '609a902c77dd235284512267';
            const product = {
                name: 'NikeUpdate1',
                description: 'NikeBLUE',
                richDescription: 'ItisaTest',
                image: 'https://img.ltwebstatic.com/images3_pi/2019/11/15/15738237944de4e21410c3dd56554191f6d977e0fc_thumbnail_600x.webp',
                brand: 'Adidas',
                price: 220,
                countInStock: 4
            };
            chai.request(server)
                .put('/api/products/' + productID)
                .send(product)
                .end((err, response) => {
                    response.should.have.status(500);
                    done();
                });
        });
    });
});
