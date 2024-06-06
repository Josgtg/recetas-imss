const header = document.querySelector('header');
const footer = document.querySelector('footer');

header.innerHTML = `
<div class="container-fluid bg-primary">
    <div class="container">
        <nav class="navbar navbar-expand-sm navbar-dark bg-primary">
            <img src="assets/img/logoIMSSlight.png" alt="" width="45">
            <button
                class="navbar-toggler d-lg-none"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapsibleNavId"
                aria-controls="collapsibleNavId"
                aria-expanded="false"
                aria-label="Toggle navigation"
            ></button>
            </div>
        </nav>
    </div>
</div>
`;

footer.innerHTML = `
    <small>Universidad Autonoma de Zacatecas</small>
`;