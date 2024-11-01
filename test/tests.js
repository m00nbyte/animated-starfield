const tests = [
    {
        label: 'default',
        options: {
            background: '#141d27',
            direction: 0,
            sizes: {
                small: {
                    amount: 50,
                    color: '#ffffff',
                    speed: 0.8,
                    blink: 2000
                },
                medium: {
                    amount: 50,
                    color: '#ffffff',
                    speed: 0.6,
                    blink: 2000
                },
                large: {
                    amount: 50,
                    color: '#ffffff',
                    speed: 0.5,
                    blink: 2000
                }
            }
        }
    },
    {
        label: 'density',
        options: {
            background: '#171717',
            direction: 0,
            sizes: {
                small: {
                    amount: 300,
                    color: '#ffffff',
                    speed: 0.8,
                    blink: 2000
                },
                medium: {
                    amount: 300,
                    color: '#ffffff',
                    speed: 0.6,
                    blink: 2000
                },
                large: {
                    amount: 300,
                    color: '#ffffff',
                    speed: 0.5,
                    blink: 2000
                }
            }
        }
    },
    {
        label: 'speed',
        options: {
            background: '#0f172a',
            direction: 0,
            sizes: {
                small: {
                    amount: 50,
                    color: '#ffffff',
                    speed: 4,
                    blink: 2000
                },
                medium: {
                    amount: 50,
                    color: '#ffffff',
                    speed: 3,
                    blink: 2000
                },
                large: {
                    amount: 50,
                    color: '#ffffff',
                    speed: 2,
                    blink: 2000
                }
            }
        }
    },
    {
        label: 'blink',
        options: {
            background: '#030712',
            direction: 0,
            sizes: {
                small: {
                    amount: 50,
                    color: '#ffffff',
                    speed: 0.8,
                    blink: 300
                },
                medium: {
                    amount: 50,
                    color: '#ffffff',
                    speed: 0.6,
                    blink: 300
                },
                large: {
                    amount: 50,
                    color: '#ffffff',
                    speed: 0.5,
                    blink: 300
                }
            }
        }
    },
    {
        label: 'direction',
        options: {
            background: '#0a0a0a',
            direction: 300,
            sizes: {
                small: {
                    amount: 50,
                    color: '#ffffff',
                    speed: 0.8,
                    blink: 2000
                },
                medium: {
                    amount: 50,
                    color: '#ffffff',
                    speed: 0.6,
                    blink: 2000
                },
                large: {
                    amount: 50,
                    color: '#ffffff',
                    speed: 0.5,
                    blink: 2000
                }
            }
        }
    },
    {
        label: 'random',
        options: {
            background: '#111827',
            direction: -1,
            sizes: {
                small: {
                    amount: 50,
                    color: '#ffffff',
                    speed: 0.8,
                    blink: 2000
                },
                medium: {
                    amount: 50,
                    color: '#ffffff',
                    speed: 0.6,
                    blink: 2000
                },
                large: {
                    amount: 50,
                    color: '#ffffff',
                    speed: 0.5,
                    blink: 2000
                }
            }
        }
    },
    {
        label: 'static',
        options: {
            background: '#18181b',
            direction: null,
            sizes: {
                small: {
                    amount: 50,
                    color: '#ffffff',
                    speed: 0,
                    blink: 2000
                },
                medium: {
                    amount: 50,
                    color: '#ffffff',
                    speed: 0,
                    blink: 2000
                },
                large: {
                    amount: 50,
                    color: '#ffffff',
                    speed: 0,
                    blink: 2000
                }
            }
        }
    },
    {
        label: 'color',
        options: {
            background: '#1e1b4b',
            direction: 0,
            sizes: {
                small: {
                    amount: 50,
                    color: 'white',
                    speed: 0.8,
                    blink: 2000
                },
                medium: {
                    amount: 50,
                    color: 'red',
                    speed: 0.6,
                    blink: 2000
                },
                large: {
                    amount: 50,
                    color: 'yellow',
                    speed: 0.5,
                    blink: 2000
                }
            }
        }
    }
];

(() => {
    window.runTests = (animatedStarField) => {
        const starFieldInstance = animatedStarField({
            container: '#container'
        });

        const labelElement = document.querySelector('#container p');
        labelElement.textContent = tests[0].label;
        starFieldInstance.updateOptions(tests[0].options);
        console.log('Applied options', tests[0].options);

        setInterval(() => {
            const currentLabel = labelElement.textContent;
            const currentIndex = tests.findIndex(({ label }) => label === currentLabel);
            const nextIndex = (currentIndex + 1) % tests.length;
            const { label, options } = tests[nextIndex];

            labelElement.textContent = label;
            starFieldInstance.updateOptions(options);

            console.log('Applied options', options);
        }, 2000);
    };
})();
