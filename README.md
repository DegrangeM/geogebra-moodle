# Geogebra-Moodle

**Ce projet n'est pas un projet officiel de Geogebra. Il s'agit d'un projet indépendant.**

Ce projet vous permet d'intégrer des exercices auto-corrigé créé sous Geogebra directement dans Moodle. Une variable `grade` contenant le score sur 100 doit alors être créé dans Geogebra. 

Il existe déjà deux plugins Moodle permettant cela. L'un permet de créer des activités Geogebra, l'autre des questions de type Geogebra. Mon projet permet de créer des questions de type Geogebra, mais ne nécessite aucune installation de plugin.

![image](https://user-images.githubusercontent.com/53106394/212564735-9c4db43c-1cc0-45bd-8be7-b19c889c1969.png)

## Obtention de l'exercice Géogebra

Vous pouvez au choix créer vous même l'exercice ou bien prendre un exercice déjà fait compatible moodle :

- [Création d'un exercice Geogebra](https://github.com/DegrangeM/geogebra-moodle/wiki/Cr%C3%A9ation-d'un-exercice-Geogebra)

- [Banque d'exercices déjà créés](https://github.com/DegrangeM/geogebra-moodle/wiki/Banque-d'exercices-d%C3%A9j%C3%A0-cr%C3%A9%C3%A9s)

## Génération du fichier GIFT

Rendez-vous sur https://degrangem.github.io/geogebra-moodle/ et remplissez les champs nécéssaires pour obtenir le fichier GIFT.
Suivez ensuite les instructions ci-dessous pour l'importer.

## Import de la question dans la banque de question

Si vous n'avez pas encore déjà créé votre activité Test (Quiz en anglais) faites le.
Accédez au menu d'importation dans la banque de question via le menu de votre activité. 

<table><tr>
<td><img src="https://user-images.githubusercontent.com/53106394/155229742-27eaae9c-48e0-495a-84c5-7df740914796.png" width="100%" /></td>
<td><img src="https://user-images.githubusercontent.com/53106394/155229764-400df559-8af3-4ebf-adae-22d9fb4f3585.png" width="100%" /></td>
</tr></table>

Sélectionner le format  `Format GIFT`, déposez votre fichier dans la zone prévu à cet effet et appuyez sur le bouton d'importation.

## Ajouter la question à un test

Retournez sur votre activité, ouvrez le menu de votre activité et cliquez sur le lien "Modifier le test".

Appuyez sur le lien "Ajouter" et sélectionnez "de la banque de question".

![image](https://user-images.githubusercontent.com/53106394/155230688-fe9fabf4-00d8-4ea8-b8bb-053b50db99a4.png)

Il ne vous reste plus qu'à cocher la question précédemment importée, puis à cliquer sur le bouton "Ajouter les questions sélectionnée".

![image](https://user-images.githubusercontent.com/53106394/155233063-d9bdf5a1-39dd-4b68-bf3a-6e4546f5ab7b.png)

## Quelques remarques sur la configuration du test

Il faut obligatoirement ne pas afficher plus d'un seul exercice learningapps à la fois dans le test moodle, il est donc conseillé de régler le test sur "1 question par page".

Il est conseillé de configurer le test sur "Feedback à postériori". Dans le cas contraire la validation d'un exercice entraînera un rechargement de la page qui fera perdre le travail en cours sur un exercice de la même page.

## Remarque importante sur la triche

Les élèves ont la possibilité de tricher en actualisant la page pour recommencer.
Les élèves doués en informatique ont aussi la possibilité de tricher en se donnant tous les points à l'exercice sans l'effectuer.
Il est possible de réduire ces risques là en utilisant l'intégration de SafeExamBrowser (voir documentation Moodle).
