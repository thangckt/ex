// Source:https://dev.to/codebubb/javascript-snow-52im



(function () {
    // Define functions
    function makeSnow({
        nSnow = 100,
        maxSize = 4,
        minSize = 1,
        maxSpeed = 1,
        minSpeed = 0.2,
        colors = ['#ddd']
    } = {}) {
        const canvas = document.createElement('canvas');
        canvas.style.position = 'fixed';
        canvas.style.pointerEvents = 'none';
        canvas.style.top = '0';
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        document.body.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        const snowflakes = [];

        // Create a single snowflake
        const createSnowflake = () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.floor(Math.random() * maxSize) + minSize,
            color: colors[Math.floor(Math.random() * colors.length)],
            speed: Math.random() * maxSpeed + minSpeed,  // Ensure snowflakes have a speed starting from 0.1
            sway: Math.random() - 0.5,
        });

        // Draw a snowflake on the canvas
        const drawSnowflake = (snowflake) => {
            ctx.beginPath();
            ctx.arc(snowflake.x, snowflake.y, snowflake.radius, 0, Math.PI * 2);
            ctx.fillStyle = snowflake.color;
            ctx.fill();
            ctx.closePath();
        };

        // Update the position of a snowflake
        const updateSnowflake = (snowflake) => {
            snowflake.y += snowflake.speed;
            snowflake.x += snowflake.sway;

            // Reset snowflake position if it falls out of view
            if (snowflake.y > canvas.height || snowflake.x < 0 || snowflake.x > canvas.width) {
                Object.assign(snowflake, createSnowflake(), { y: 0 });
            }
        };

        // Animation loop
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            snowflakes.forEach((snowflake) => {
                updateSnowflake(snowflake);
                drawSnowflake(snowflake);
            });
            requestAnimationFrame(animate);
        };

        // Initialize snowflakes
        for (let i = 0; i < nSnow; i++) {
            snowflakes.push(createSnowflake());
        }

        // Update canvas size on window resize
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });

        // Adjust canvas position on scroll
        window.addEventListener('scroll', () => {
            canvas.style.top = `${window.scrollY}px`;
        });

        animate();
    }

    function dayToRun() {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1; // Months are 0-based
        const currentDay = currentDate.getDate();

        // Check if current date is between Dec 10 and Jan 10
        if ((currentMonth === 12 && currentDay >= 10) || (currentMonth === 1 && currentDay <= 10)) {
            makeSnow({ nSnow: 60, maxSize: 4, maxSpeed: 0.7, colors: ['#ffffff', '#ddddd', '#C0C0C0', '#808080', '#b0e0e6', '#e0ffff'] });
        }
    }

    // Call the functions
    dayToRun();
})();
