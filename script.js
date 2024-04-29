document.addEventListener("DOMContentLoaded", function() {
    const checkboxes = document.querySelectorAll('.checkbox');

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const isChecked = this.checked;
            const itemId = this.id;

            // Salvataggio dello stato della checkbox nello localStorage
            localStorage.setItem(itemId, isChecked);
        });

        // Caricamento dello stato della checkbox dal localStorage
        const isChecked = localStorage.getItem(checkbox.id);
        if (isChecked === 'true') {
            checkbox.checked = true;
        }
    });
});




