'use strict'

const md5 = require('md5')
const axios = require('axios')

const nonce = length => Array.from({length}, () => [...'abcdefghijklmnopqrstuvwxyz0123456789'][Math.floor(Math.random() * 36)]).join('')
const time = () => Math.floor(Date.now() / 1000)

class Lan {
    constructor(ip, user = '', key = '') {
        this.ip = ip
        this.user = user
        this.key = key
    }

    header() {
        const messageId = md5(nonce(16))
        const timestamp = time()
        const sign = md5(messageId + this.key + timestamp)
        return  {
            messageId,
            timestamp,
            sign
        }
    }

    async request(method, namespace, payload) {
        const messageId = md5(nonce(16))
        const timestamp = time()
        const sign = md5(messageId + this.key + timestamp)

        const body = {
            header: {
                method,
                namespace,
                messageId,
                timestamp,
                sign
            },
            payload
        }

        const options = {
            headers: {
                'Content-Type': 'application/json'
            },
        }

        try {
            return axios.post(`http://${this.ip}/config`, body, options)
        } catch (error) {
            console.error(error);
        }
    }
}

class Device
{
    constructor(ip) {
        this.lan = new Lan(ip)
        this.type = null
        this.wifi = null
    }

    async listWifi() {
        const response = await this.lan.request('GET', 'Appliance.Config.WifiList', {});
        return response?.data?.payload?.wifiList;
    }
}

module.exports = Device;
