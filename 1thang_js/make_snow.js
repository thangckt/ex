// Source:https://dev.to/codebubb/javascript-snow-52im



(function () {
    // Define functions
    function makeSnow({
        nSnow = 100,
        maxSize = 4,
        maxSpeed = 1,
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
            radius: Math.floor(Math.random() * maxSize) + 1,
            color: colors[Math.floor(Math.random() * colors.length)],
            speed: Math.random() * maxSpeed + 1,
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


    function getDayOfYear(date) {
        const start = new Date(date.getFullYear(), 0, 0);
        const diff = date - start;
        const oneDay = 1000 * 60 * 60 * 24;
        return Math.floor(diff / oneDay);
    }

    function dayToRun(startDay, startMonth, endDay, endMonth) {
        const currentDate = new Date();
        const currentDayOfYear = getDayOfYear(currentDate);

        const startDate = new Date(currentDate.getFullYear(), startMonth - 1, startDay);
        const endDate = new Date(currentDate.getFullYear(), endMonth - 1, endDay);

        const startDayOfYear = getDayOfYear(startDate);
        const endDayOfYear = getDayOfYear(endDate);

        let isInInterval = false;

        if (startDayOfYear <= endDayOfYear) {
            isInInterval = currentDayOfYear >= startDayOfYear && currentDayOfYear <= endDayOfYear;
        } else {
            // If the range crosses the year boundary
            isInInterval = currentDayOfYear >= startDayOfYear || currentDayOfYear <= endDayOfYear;
        }

        if (isInInterval) {
            makeSnow({ nSnow: 100, maxSize: 5, maxSpeed: 1, colors: ['#ddd', '#aab7b8'] });
        }
    }

    // Call the functions
    dayToRun(10, 12, 10, 1); // Run from December 10th to January 10th

})();
