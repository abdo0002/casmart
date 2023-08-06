const 
    btnDeposit = document.querySelector('.header-5'),
    alertDeposit = document.querySelector('.deposit-1')
;

if (btnDeposit) {
    btnDeposit.addEventListener('click', () => {
        if (alertDeposit.style.display == 'flex') {
            alertDeposit.style.display = 'none';
        }else alertDeposit.style.display = 'flex';
    });
}