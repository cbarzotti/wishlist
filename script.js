document.addEventListener("DOMContentLoaded", function() {
    const checkboxes = document.querySelectorAll('.checkbox');

    checkboxes.forEach(checkbox => {
        
        checkbox.addEventListener('change', function() {
            const isChecked = this.checked;
            const itemId = this.id;
            console.log("Set item:", itemId, isChecked)
            // Salvataggio dello stato della checkbox nello localStorage
            localStorage.setItem(itemId, isChecked);
        });

        const isChecked = localStorage.getItem(checkbox.id);
        console.log("Is Checked:",checkbox.id, isChecked);
        if (isChecked === 'true') {
            checkbox.checked = true;
        }
        else {
            checkbox.checked = false;
        };
    });

    function refreshState() {
        checkboxes.forEach(checkbox => {
            const isChecked = localStorage.getItem(checkbox.id);
            console.log("Refreshing:",checkbox.id, isChecked);
            if (isChecked === 'true') {
                checkbox.checked = true;
            };
        });
    };

    setInterval(refreshState, 10000);
});




