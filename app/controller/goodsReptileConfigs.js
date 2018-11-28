'use strict';

const Controller = require('../core/base_controller');

const reptileConfigRule = {
    name: {
        type: 'string',
        required: false,
    },
    site_name: {
        type: 'string',
        required: false,
    },
    url: {
        type: 'string',
    },
    query_selector: {
        type: 'string',
    },
    current_price: {
        type: 'number',
        required: false,
    },
    lowest_price: {
        type: 'number',
        required: false,
    },
    expect_price: {
        type: 'number',
        required: false,
    },
    lowest_price_time: {
        type: 'date',
        required: false,
    },
    is_phone: {
        type: 'boolean',
        required: true,
    }
}

class ReptileConfigController extends Controller {

    async create() {
        const { ctx, service } = this;
        try {
            ctx.validate(reptileConfigRule);
            const res = await service.goodsReptileConfigs.create(ctx.request.body);
            this.success(res);
        } catch (err) {
            this.fail(ctx.UNIQUE_CODE, this.formatValidateError(err));
        }
    }

    async update() {
        const { ctx, service } = this;
        reptileConfigRule.id = {
            type: 'int',
        }
        try {
            ctx.validate(reptileConfigRule);
            const res = await service.goodsReptileConfigs.update(ctx.request.body);
            this.success({ id: res});
        } catch (err) {
            this.fail(ctx.UNIQUE_CODE, this.formatValidateError(err));
        }
    }

    async getList() {
        const { ctx, service } = this;
        const rule = {
            page : {
                type: 'int',
                required: false,
            },
            size : {
                type: 'int',
                required: false,
            }
        }
        try {
            ctx.validate(rule);
            const res = await service.goodsReptileConfigs.getList({}, ctx.request.body.page || 1, ctx.request.body.size || 20);
            this.success(res);
        } catch (err) {
            this.fail(ctx.UNIQUE_CODE, this.formatValidateError(err));
        }
    }
}

module.exports = ReptileConfigController;