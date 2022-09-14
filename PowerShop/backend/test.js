import chai from "chai"
import axios from "axios"
var assert = chai.assert;
async function getFoo() {
    const {status} = await axios.get('localhost:5000/api/products?category=power&keyword=&pageNumber=')
    return status
  }
  
  describe('#getFoo', () => {
    it('returns foo', async () => {
      const result = await getFoo()
      assert.equal(result,200)
    })
  })