// QZ Tray Security Setup - Using Demo Certificate
function setupQZSecurity() {
    qz.security.setCertificatePromise(function(resolve, reject) {
        fetch('https://raw.githubusercontent.com/qzind/qz-tray/master/assets/signing/digital-certificate.txt')
            .then(response => response.text())
            .then(cert => resolve(cert))
            .catch(err => reject(err));
    });

    qz.security.setSignatureAlgorithm('SHA512');
    qz.security.setSignaturePromise(function(toSign) {
        return function(resolve, reject) {
            fetch('https://demo.qz.io/sign-message?request=' + toSign)
                .then(response => response.text())
                .then(signature => resolve(signature))
                .catch(err => reject(err));
        };
    });
}

if (typeof qz !== 'undefined') {
    setupQZSecurity();
}
