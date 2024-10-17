// Fonction pour extraire les commentaires en parcourant les éléments correspondants
function getComments() {
    let comments = [];

    // Sélectionner tous les éléments ayant "PCommentText" dans leur classe
    document.querySelectorAll('[class*="PCommentText"]').forEach(commentElement => {
        let commentText = commentElement.innerText;  // Extraire le texte du commentaire
        comments.push(commentText);  // Ajouter le texte à la liste des commentaires
    });

    return comments;
}

// Fonction pour masquer les commentaires haineux
function hideHateSpeechComments(comments) {
    // Faire une requête à ton API Flask pour tester les commentaires
    fetch('http://localhost:5000/test', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phrases: comments }),  // Envoi de tous les commentaires à la fois
    })
    .then(response => response.json())
    .then(data => {
        // Supposons que `data` soit un tableau avec les résultats pour chaque commentaire
        comments.forEach((comment, index) => {
            if (data[index].result === 'Hate Speech') { // Vérifier le résultat pour chaque commentaire
                // Masquer le commentaire en utilisant le texte original pour le trouver dans le DOM
                document.querySelectorAll('[class*="PCommentText"]').forEach(commentElement => {
                    if (commentElement.innerText === comment) {
                        commentElement.style.display = 'none'; // Masquer le commentaire
                    }
                });
            }
        });
    })
    .catch(error => console.error('Erreur:', error));
}

// Récupérer les commentaires et masquer ceux qui sont haineux
const comments = getComments(); // Récupérer les commentaires
chrome.runtime.sendMessage({ comments: comments }); // Envoyer les commentaires au script en arrière-plan

// Appeler la fonction pour masquer les commentaires haineux
hideHateSpeechComments(comments); // Passer les commentaires à la fonction
