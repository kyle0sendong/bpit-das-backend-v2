const asyncHandler = require('express-async-handler');
const CurrentValueModel = require("./CurrentValueModel");


class CurrentValueController {

  getCurrentValues = asyncHandler( async(req, res) => {
    const id = req.query.id ?? 0;

    if (id > 0) {
      const result = await CurrentValueModel.getAllCurrentValuesTcp(req.query.id);
      return res.status(200).json(result);
    } else {
      const currentValues = await CurrentValueModel.getAll();
      return res.status(200).json(currentValues);
    }
  })
  
  insertCurrentValue = asyncHandler( async(req, res) => {
    await CurrentValueModel.insert(req.body);
    return res.status(200).send(`Inserted current value for new parameter`);
  })
  
  updateCurrentValue = asyncHandler( async(req, res) => {
    await CurrentValueModel.update(req.body);
    return res.status(200).send(`Inserted current value for new parameter`);
  })
}



module.exports = new CurrentValueController();
