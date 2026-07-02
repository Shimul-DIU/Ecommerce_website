
const productController = (req,res) => {
  let {name,category,status,price,stock,description}=req.body
  let image=req.file.filename;

  res.send('server error')



};

export default productController;