'use strict';

const os = require('os')

module.exports = [
    {
        name: 'Smart Plug',
        wifiName: 'Meross_SW_xxxx',
        setup: [
            {
                title: 'Plug in Smart Plug',
                description: 'Plug your Smart Plug in. Press the power button, if the LED is not on.',
                buttons: async () => [
                    {label: 'Next', goto: (step) => step + 1},
                ]
            },
            {
                title: 'Check the LED Light',
                description: 'In about 10 seconds the LED light will begin blinking amber and green slowly.',
                buttons: async () => [
                    {label: 'Next', goto: (step) => 3},
                    {label: 'The LED is NOT blinking amber and green.', goto: (step) => 2},
                ],
            },
            {
                title: 'Start configuration',
                description: 'Press and hold the power button for 5 seconds. Wait about 20 seconds until the LED light starts blinking amber and green.',
                buttons: async () => [
                    {label: 'Got it', goto: (step) => 1},
                ]
            },
            {
                title: 'Connect to Device',
                description: 'Connect to the device Wi-Fi',
                buttons: async () => [
                    {label: 'I\'m connected to the device Wi-Fi.', goto: (step) => step + 1},
                ],
                valid: async () => {
                    for (const iface of Object.values(os.networkInterfaces())) {
                        for (const addr of iface) {
                            if (!addr.internal && addr.address === '10.10.10.2') { // would be better to check the SSID name of the WIFI interface is connected to.
                                return true
                            }
                        }
                        return false
                    }
                }
            },
            {
                init: (device) => {
                    console.log(this)
                    process.exit()
                    // (await device.listWifi()).map(ap => {
                    //     return {
                    //         label: ap.ssid == '' ? `<hidden ${ap.bssid}>` : ap.ssid,
                    //         goto: (step) => step + 1
                    //     }
                    // })
                },
                title: 'Join Your Home Wi-Fi',
                description: 'Please enter your Wi-Fi password to connect your device to your home network.',
                fields: [
                    {
                        label: 'Change Network',
                        type: 'inputField',
                        options: {
                            autocomplete: str => {

                            }
                        }
                    },
                    {
                        label: 'Password',
                        type: 'inputField',
                    }
                ],
                input: async str => {

                },
                buttons: async (device) => (await device.listWifi()).map(ap => {
                    return {
                        label: ap.ssid == '' ? `<hidden ${ap.bssid}>` : ap.ssid,
                        goto: (step) => step + 1
                    }
                }),
                // buttonDisplay: 'gridMenu',
            },
        ],
    },
    {
        name: 'Smart Wall Strip',
        wifiName: 'Meross_SL_xxxx',
        setup: [],
    },
    {
        name: 'Smart Switch',
        wifiName: 'Meross_SW_xxxx',
        setup: [],
    },
    {
        name: 'Smart Bulb',
        wifiName: 'Meross_LB_xxxx',
        setup: [],
    },
    {
        name: 'Smart LED Light Strip',
        wifiName: 'Meross_SL_xxxx',
        setup: [],
    },
];
