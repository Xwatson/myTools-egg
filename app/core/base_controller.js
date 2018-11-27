'use strict';

const { Controller } = require('egg');

/**
 * BaseController
 * @class
 * @author ruiyong-lee
 */
class BaseController extends Controller {

    success(data, status) {
        this.ctx.body = { code: 0, data };
        this.ctx.status = status || 200;
    }

    fail(code, message) {
        this.ctx.body = { code: code || 1, message };
        this.ctx.status = 200;
    }
    formatValidateError(err) {
        if (err.message == 'Validation Failed') {
            return err.errors.map((item) => `${item.field} ${item.code}`).join(',');
        } else {
            return err.message;
        }
    }
    notFound(msg) {
        msg = msg || 'not found';
        this.ctx.throw(404, msg);
    }
}

module.exports = BaseController;