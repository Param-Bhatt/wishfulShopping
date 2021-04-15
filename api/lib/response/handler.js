const response = require('./response')

const handle = (res, err) => {
  /*Large file size error multer*/
  if (err.code === 'LIMIT_FILE_SIZE') {
    response.bad(res, {}, "File size limit exceeded", true);
    return;
  }
  switch (err.status) {
    case 401 :
      return (err.message.length > 0) ? response.unauthorized(res, {}, err.message, true) : response.unauthorized(res)
      break
    case 422 :
      return (err.message.length > 0) ? response.unprocessable(res, {}, err.message, true) : response.unprocessable(res)
      break
    case 404 :
      return (err.message.length > 0) ? response.notFound(res, {}, err.message, true) : response.notFound(res)
      break
    case 400 :
      return (err.message.length > 0) ? response.bad(res, {}, err.message, true) : response.bad(res)
      break
    case 500 :
      return (err.message.length > 0) ? response.error(res, {}, err.message, true) : response.err(res)
      break
    default :
      res.status(err.status || 500).json({ data: {}, err: true, msg: err.message })
  }
}

module.exports = handle
