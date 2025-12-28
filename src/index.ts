export interface StarOptions {
    amount: number;
    blink: number;
    speed: number;
    color: string;
}

export type StarFieldOptions = {
    container?: string;
    background: string;
    direction: number | null;
    sizes: {
        small: StarOptions;
        medium: StarOptions;
        large: StarOptions;
    };
    fadeInDuration?: number;
    fadeInFrom?: 'white' | 'black' | 'transparent';
};

/**
 * Recursively merges two objects, deeply combining nested properties.
 *
 * @param {T} target - The target object to merge into (base options).
 * @param {Partial<T>} source - The source object to merge from (overrides).
 * @returns {T} The target object after merging in the source properties.
 */
const deepMergeOptions = <T extends object>(target: T, source: Partial<T>): T => {
    // Helper function to check value type
    const isObject = (value: unknown): value is object => value !== null && typeof value === 'object';

    // Iterate over each key-value pair in the source object
    for (const [key, sourceValue] of Object.entries(source)) {
        const targetValue = target[key as keyof T];

        if (isObject(targetValue) && isObject(sourceValue)) {
            // Recursively merge objects
            target[key as keyof T] = deepMergeOptions(targetValue, sourceValue);
        } else if (sourceValue !== undefined) {
            // Assign the source value
            target[key as keyof T] = sourceValue as T[Extract<keyof T, string>];
        }
    }

    return target;
};

/**
 * Represents a star in a field of stars with various properties.
 * This class handles the star's animation and blinking effect.
 *
 * @param {string} type - The type of the star (small, medium, large).
 * @param {number} x - The initial x-coordinate of the star on the canvas.
 * @param {number} y - The initial y-coordinate of the star on the canvas.
 * @param {number} color - The color of the star.
 * @param {number} size - The size of the star.
 * @param {number | null} direction - The direction of the star's movement in degrees or null for no movement.
 * @param {number} speed - The speed at which the star moves across the canvas.
 * @param {number} blink - The duration of the blinking effect, in milliseconds.
 */
class Star {
    type: string;
    x: number;
    y: number;
    color: string;
    size: number;
    direction: number | null;
    speed: number;
    blink: number;
    opacity: number;
    delay: number;

    constructor(
        type: string,
        x: number,
        y: number,
        color: string,
        size: number,
        direction: number | null,
        speed: number,
        blink: number
    ) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = size;
        this.direction = direction;
        this.speed = speed;
        this.blink = blink;

        this.opacity = 1;
        this.delay = Math.random() * 2000 + Math.random() * 1000;
    }

    /**
     * Updates the star's state, including its position, speed and opacity.
     *
     * @param {number} time - The current time for calculating blinking effect.
     * @returns {void} This function has no output.
     */
    public update(time: number): void {
        const { speed, direction, blink, delay } = this;

        // Check if blinking effect is enabled
        if (blink > 0) {
            // Calculate opacity based on blinking effect, clamped between 0.5 and 1
            const blinkFactor = Math.sin(((time + delay) / blink) * Math.PI);
            this.opacity = 0.5 + 0.5 * Math.abs(blinkFactor);
        }

        // Check if speed and direction is enabled
        if (speed > 0 && direction !== null) {
            // Convert direction from degrees to radians for movement calculations
            const radians = (direction + 90) * (Math.PI / 180);

            // Calculate new position
            const dx = Math.cos(radians) * speed;
            const dy = Math.sin(radians) * speed;

            // Update star's position
            this.x += dx;
            this.y += dy;
        }
    }
}

/**
 * Represents a field of stars rendered on a canvas. This class manages the creation
 * and rendering of stars, their movement, the overall visual display, and provides
 * functionality to dynamically update the options.
 *
 * @param {HTMLElement} container - The parent element where the canvas will be appended.
 * @param {StarFieldOptions} options - The initial options for the star field.
 */
class StarField {
    options: StarFieldOptions;
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    stars: Star[];
    width: number;
    height: number;
    parent: HTMLElement;
    fadeInProgress: number;
    fadeInDuration: number;
    fadeInFrom: 'white' | 'black' | 'transparent';
    startTime: number;

    constructor(container: HTMLElement, options: StarFieldOptions) {
        const { direction, sizes } = options;

        // Store the parent container and the initial options
        this.parent = container;
        this.options = options;

        // Create a canvas element and set its rendering context
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d')!;

        // Position the canvas
        this.canvas.style.position = 'absolute';

        // Add the canvas to the parent container
        container.appendChild(this.canvas);

        // Get the parent element's dimensions
        const { clientWidth, clientHeight } = this.parent;

        // Initialize dimensions based on the parent element's size
        this.width = clientWidth;
        this.height = clientHeight;

        // Generate initial stars based on the options
        this.stars = this.generateStars(sizes, direction);

        // Initialize fade-in properties
        this.fadeInProgress = 0;
        this.fadeInDuration = options.fadeInDuration || 1000;
        this.fadeInFrom = options.fadeInFrom || 'black';
        this.startTime = performance.now();

        // Resize the canvas to match the parent container
        this.resizeCanvas();

        // Start the animation loop for the stars
        this.animateStars();

        // Attach event listener for window resize events
        window.addEventListener('resize', () => this.handleResize());
    }

    /**
     * Resizes the canvas to match the dimensions of its parent element.
     *
     * @returns {void} This function has no output.
     */
    private resizeCanvas(): void {
        // Get the parent element's dimensions
        const { clientWidth, clientHeight } = this.parent;

        // Set the internal dimensions to match the parent element
        this.width = clientWidth;
        this.height = clientHeight;

        // Update the canvas dimensions
        this.canvas.width = clientWidth;
        this.canvas.height = clientHeight;
    }

    /**
     * Handles canvas resizing and adjusts the star's positions.
     *
     * @returns {void} This function has no output.
     */
    private handleResize(): void {
        // Store the old canvas dimensions before resizing
        const oldWidth = this.width;
        const oldHeight = this.height;

        // Resize the canvas to the current window dimensions
        this.resizeCanvas();

        // Calculate the width and height scale ratios
        const widthScale = this.width / oldWidth;
        const heightScale = this.height / oldHeight;

        // Update stars positions based on the scale ratios
        for (const star of this.stars) {
            // Scale the x and y positions relative to the new canvas dimensions
            star.x *= widthScale;
            star.y *= heightScale;
        }
    }

    /**
     * Draws a star on the canvas based on the options.
     *
     * @param {Star} star - The star object containing its properties.
     * @returns {void} This function has no output.
     */
    private drawStar(star: Star): void {
        const { x, y, size, opacity, color } = star;
        const { context } = this;

        // Begin a new path for the star
        context.beginPath();
        context.arc(x, y, size, 0, Math.PI * 2);

        // Check if the color is in a format that needs an opacity (RGB or HSL)
        if (color.startsWith('rgb') || color.startsWith('hsl')) {
            // Apply the color with opacity directly using `rgba` or `hsla`
            context.fillStyle = color.replace(')', `, ${opacity})`).replace('rgb', 'rgba').replace('hsl', 'hsla');
        } else {
            // Set color as is, but control opacity via `globalAlpha` for hex/named colors
            context.globalAlpha = opacity;
            context.fillStyle = color;
        }

        // Fill the star with the color
        context.fill();

        // Reset globalAlpha to 1 after drawing to avoid affecting other elements
        context.globalAlpha = 1;
    }

    /**
     * Generates an array of stars based on the given options.
     *
     * @param {Object<string, StarOptions>} starOptions - The stars options object.
     * @param {number | null} direction - The movement direction of the stars.
     * @returns {Star[]} An array of newly generated stars.
     */
    private generateStars(starOptions: { [key: string]: StarOptions }, direction: number | null): Star[] {
        const stars: Star[] = [];

        // Define star sizes
        const sizeMapping: { [key: string]: number } = {
            small: 0.5,
            medium: 1,
            large: 1.5
        };

        // Helper function to get a random position within a given axis size
        const getRandomPosition = (size: number) => Math.random() * size;

        // Generate stars based on the provided options for each size
        for (const [type, { amount, color, speed, blink }] of Object.entries(starOptions)) {
            // Retrieve star size from mapping
            const size = sizeMapping[type as keyof typeof sizeMapping];

            // Skip if size is not defined
            if (!size) continue;

            // Create new stars
            for (let i = 0; i < amount; i++) {
                const { width, height } = this;

                // Define new x and y coordinates
                const x = getRandomPosition(width);
                const y = getRandomPosition(height);

                // Determine the star's direction
                const newDirection = direction === -1 ? Math.random() * 360 : direction ?? 0;

                // Set speed to 0 if direction is null, otherwise use the provided speed
                const newSpeed = direction === null ? 0 : speed;

                // Create a new star and add it to the array
                stars.push(new Star(type, x, y, color, size, newDirection, newSpeed, blink));
            }
        }

        return stars;
    }

    /**
     * Animates the field of stars by updating star positions and redrawing the canvas on each frame.
     *
     * @returns {void} This function has no output.
     */
    private animateStars(): void {
        const { context, width, height, options, stars } = this;
        const time = performance.now();

        // Clear the canvas
        context.clearRect(0, 0, width, height);

        // Handle fade-in effect
        if (this.fadeInProgress < 1) {
            this.fadeInProgress = Math.min(1, (time - this.startTime) / this.fadeInDuration);
        }

        // Handle background fade-in based on fadeInFrom option
        if (this.fadeInProgress < 1 && this.fadeInFrom !== 'transparent') {
            // Calculate intermediate color during fade
            if (this.fadeInFrom === 'white') {
                // Fade from white to background
                const progress = this.fadeInProgress;
                const r1 = 255,
                    g1 = 255,
                    b1 = 255; // White
                const r2 = parseInt(options.background.slice(1, 3), 16);
                const g2 = parseInt(options.background.slice(3, 5), 16);
                const b2 = parseInt(options.background.slice(5, 7), 16);

                const r = Math.round(r1 + (r2 - r1) * progress);
                const g = Math.round(g1 + (g2 - g1) * progress);
                const b = Math.round(b1 + (b2 - b1) * progress);

                context.fillStyle = `rgb(${r}, ${g}, ${b})`;
            } else {
                // Fade from black to background
                const progress = this.fadeInProgress;
                const r1 = 0,
                    g1 = 0,
                    b1 = 0; // Black
                const r2 = parseInt(options.background.slice(1, 3), 16);
                const g2 = parseInt(options.background.slice(3, 5), 16);
                const b2 = parseInt(options.background.slice(5, 7), 16);

                const r = Math.round(r1 + (r2 - r1) * progress);
                const g = Math.round(g1 + (g2 - g1) * progress);
                const b = Math.round(b1 + (b2 - b1) * progress);

                context.fillStyle = `rgb(${r}, ${g}, ${b})`;
            }
            context.fillRect(0, 0, width, height);
        } else {
            // Normal background when fade-in is complete
            context.fillStyle = options.background;
            context.fillRect(0, 0, width, height);
        }

        // Helper function to reset star position based on boundary checks
        const resetPosition = (value: number, limit: number) => (value < 0 ? limit : value > limit ? 0 : value);

        // Helper function to randomize star position within the given size
        const randomizePosition = (size: number) => Math.random() * size;

        // Update and draw each star
        for (const star of stars) {
            star.update(time);

            // Apply fade-in to star opacity if fading from transparent
            if (this.fadeInFrom === 'transparent' && this.fadeInProgress < 1) {
                const originalOpacity = star.opacity;
                star.opacity = originalOpacity * this.fadeInProgress;
                this.drawStar(star);
                star.opacity = originalOpacity; // Restore original opacity
            } else {
                // Draw star normally (opacity handled in drawStar method)
                this.drawStar(star);
            }

            // Reset the star's position
            star.x = resetPosition(star.x, width);
            star.y = resetPosition(star.y, height);

            // Randomize y-axis if x-axis was reset
            if (star.x === 0 || star.x === width) {
                star.y = randomizePosition(height);
            }

            // Randomize x-axis if y-axis was reset
            if (star.y === 0 || star.y === height) {
                star.x = randomizePosition(width);
            }
        }

        // Request the next frame to continue the animation
        requestAnimationFrame(() => this.animateStars());
    }

    /**
     * Updates the options by merging new options into the existing settings.
     *
     * @param {Partial<StarFieldOptions>} newOptions - New options values to merge with the current settings.
     * @returns {void} This function has no output.
     */
    public updateOptions(newOptions: Partial<StarFieldOptions>): void {
        // Deep clone the new options
        const partialOptions = structuredClone
            ? // Use structuredClone for modern browsers
              structuredClone(newOptions)
            : // Fallback to JSON for compatibility
              JSON.parse(JSON.stringify(newOptions));

        // Don't allow to change the container
        if (partialOptions.hasOwnProperty('container')) {
            delete partialOptions.container;
        }

        // Merge the new options into the existing options
        this.options = deepMergeOptions(this.options, partialOptions);

        // Destructure properties from the new options for easy access
        const { background, direction, sizes } = partialOptions;

        // Update background color
        if (background !== undefined) {
            this.options.background = background;
        }

        // Update each star's speed and direction
        for (const star of this.stars) {
            // Stop star movement
            if (direction === null) {
                star.direction = 0;
                star.speed = 0;
                continue;
            }

            // Get star options for star type
            const { color, speed } = sizes[star.type as keyof typeof sizes];

            // Update the star color
            star.color = color ?? star.color;

            // Update direction and speed
            star.direction = direction === -1 ? Math.random() * 360 : direction ?? star.direction;
            star.speed = speed ?? star.speed;
        }

        // Regenerate stars
        if (sizes) {
            const { sizes, direction } = this.options;
            this.stars = this.generateStars(sizes, direction);
        }
    }
}

/**
 * Initializes the StarField animation with user-defined or default options.
 *
 * @param {Partial<StarFieldOptions>} options - Custom options for the animation.
 * @returns {StarField | null} A new instance if a valid container is found, otherwise null.
 */
const initialize = (options: Partial<StarFieldOptions>): StarField | null => {
    const defaultOptions: StarFieldOptions = {
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
        },
        fadeInDuration: 1000,
        fadeInFrom: 'black'
    };

    // Combine user-provided options with default settings
    const mergedOptions: StarFieldOptions = deepMergeOptions(defaultOptions, options);
    const containerSelector = mergedOptions.container;

    // Container selector is not specified
    if (!containerSelector) return null;

    const scrollContainer = document.querySelector<HTMLDivElement>(containerSelector);

    // Container element isn't found
    if (!scrollContainer) return null;

    // Create and return a new instance with the merged options
    return new StarField(scrollContainer, mergedOptions);
};

export default initialize;
