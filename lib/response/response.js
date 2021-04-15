const successResponse = (res, data = {}, msg = '', err = false) => {
    const resBody = {
      err: err,
      msg: msg,
      data: data
    }
    res.status(200).json(resBody)
  }
  
  const createdResponse = (res, data = {}, msg = '', err = false) => {
    const resBody = {
      err: err,
      msg: msg,
      data: data
    }
    res.status(201).json(resBody)
  }
  
  const errorResponse = (res, data = {}, msg = 'Server is having trouble, please try after sometime', err = true) => {
    const resBody = {
      err: err,
      msg: msg,
      data: data
    }
    res.status(500).json(resBody)
  }
  
  const notFoundResponse = (res, data = {}, msg = 'Service not available currently', err = true) => {
    const resBody = {
      err: err,
      msg: msg,
      data: data
    }
    res.status(404).json(resBody)
  }
  
  const badRequestResponse = (res, data = {}, msg = 'Bad request', err = true) => {
    const resBody = {
      err: err,
      msg: msg,
      data: data
    }
    res.status(400).json(resBody)
  }
  
  const unprocessableResponse = (res, data = {}, msg = 'Server refused to process request', err = true) => {
    const resBody = {
      err: err,
      msg: msg,
      data: data
    }
    res.status(422).json(resBody)
  }
  
  const unauthorizedResponse = (res, data = {}, msg = 'Unauthorized, please login again', err = true) => {
    const resBody = {
      err: err,
      msg: msg,
      data: data
    }
    res.status(401).json(resBody)
  }
  
  module.exports = {
    success: successResponse,
    error: errorResponse,
    created: createdResponse,
    unprocessable: unprocessableResponse,
    unauthorized: unauthorizedResponse,
    bad: badRequestResponse,
    notFound: notFoundResponse
  }
  