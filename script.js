
document.getElementById('cutButton').addEventListener('click', function() {
    const imageUpload = document.getElementById('imageUpload');
    const spriteWidth = parseInt(document.getElementById('spriteWidth').value);
    const spriteHeight = parseInt(document.getElementById('spriteHeight').value);

    if (!imageUpload.files[0] || !spriteWidth || !spriteHeight) {
        alert('Please upload an image and specify the sprite dimensions.');
        return;
    }

    const img = new Image();
    const file = imageUpload.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        img.src = e.target.result;
    };

    reader.readAsDataURL(file);

    img.onload = function() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const spriteContainer = document.getElementById('spriteContainer');
        spriteContainer.innerHTML = ''; // Clear previous sprites

        for (let y = 0; y < img.height; y += spriteHeight) {
            for (let x = 0; x < img.width; x += spriteWidth) {
                const spriteCanvas = document.createElement('canvas');
                const spriteCtx = spriteCanvas.getContext('2d');
                spriteCanvas.width = spriteWidth;
                spriteCanvas.height = spriteHeight;

                spriteCtx.drawImage(
                    canvas,
                    x, y, spriteWidth, spriteHeight,
                    0, 0, spriteWidth, spriteHeight
                );

                const spriteImg = new Image();
                spriteImg.src = spriteCanvas.toDataURL();
                spriteImg.className = 'sprite';
                spriteImg.addEventListener('click', function() {
                    spriteImg.classList.toggle('selected');
                });
                spriteContainer.appendChild(spriteImg);
            }
        }
    };
});

document.getElementById('downloadSelectedButton').addEventListener('click', function() {
    const selectedSprites = document.querySelectorAll('.sprite.selected');
    if (selectedSprites.length === 0) {
        alert('No sprites selected for download.');
        return;
    }

    selectedSprites.forEach((sprite, index) => {
        const a = document.createElement('a');
        a.href = sprite.src;
        a.download = `sprite-${index + 1}.png`;
        a.click();
    });
});

document.getElementById('downloadAllButton').addEventListener('click', function() {
    const sprites = document.querySelectorAll('.sprite');
    if (sprites.length === 0) {
        alert('No sprites available for download.');
        return;
    }

    const zip = new JSZip();
    sprites.forEach((sprite, index) => {
        const imgData = sprite.src.replace(/^data:image\/(png|jpg);base64,/, "");
        zip.file(`sprite-${index + 1}.png`, imgData, {base64: true});
    });

    zip.generateAsync({type: "blob"})
        .then(function(content) {
            saveAs(content, "sprites.zip");
        });
});
