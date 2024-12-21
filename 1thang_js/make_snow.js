// Source:https://dev.to/codebubb/javascript-snow-52im



(function () {
    // Define functions
    function make_snow(nSnow = 100, maxSize = 4, maxSpeed = 1, color = '#ddd') {
        const NUMBER_OF_SNOWFLAKES = nSnow;
        const MAX_SNOWFLAKE_SIZE = maxSize;
        const MAX_SNOWFLAKE_SPEED = maxSpeed;
        const SNOWFLAKE_COLOUR = color;

        const snowflakes = [];
        const canvas = document.createElement('canvas');
        canvas.style.position = 'fixed';
        canvas.style.pointerEvents = 'none';
        canvas.style.top = '0px';
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        document.body.appendChild(canvas);

        const ctx = canvas.getContext('2d');


        const createSnowflake = () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.floor(Math.random() * MAX_SNOWFLAKE_SIZE) + 1,
            color: SNOWFLAKE_COLOUR,
            speed: Math.random() * MAX_SNOWFLAKE_SPEED + 1,
            sway: Math.random() - 0.5 // next
        });

        const drawSnowflake = snowflake => {
            ctx.beginPath();
            ctx.arc(snowflake.x, snowflake.y, snowflake.radius, 0, Math.PI * 2);
            ctx.fillStyle = snowflake.color;
            ctx.fill();
            ctx.closePath();
        }

        const updateSnowflake = snowflake => {
            snowflake.y += snowflake.speed;
            snowflake.x += snowflake.sway; // next
            if (snowflake.y > canvas.height) {
                Object.assign(snowflake, createSnowflake());
            }
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            snowflakes.forEach(snowflake => {
                updateSnowflake(snowflake);
                drawSnowflake(snowflake);
            });

            requestAnimationFrame(animate);
        }

        for (let i = 0; i < NUMBER_OF_SNOWFLAKES; i++) {
            snowflakes.push(createSnowflake());
        }

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });

        window.addEventListener('scroll', () => {
            canvas.style.top = `${window.scrollY}px`;
        });

        // setInterval(animate, 15);
        animate()
    }

    function dayToRun(startDate, endDate) {
        const currentDate = new Date(); // Get the current date
        const start = new Date(startDate); // Convert start date to a Date object
        const end = new Date(endDate); // Convert end date to a Date object

        if (currentDate >= start && currentDate <= end) {
            make_snow(nSnow = 80, maxSize = 4, maxSpeed = 1, color = '#ddd');
        }
    }

    // Call the functions
    const startDate = "2024-12-10"; // Define the start of the interval
    const endDate = "2025-01-10"; // Define the end of the interval
    dayToRun(startDate, endDate)

})();