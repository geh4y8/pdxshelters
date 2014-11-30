Contributing to PDXShelter
==========================

Thank you for your interest in helping our project, you will be helping not just the project team, but those we serve.

Getting setup
--------------

This is a step-by-step guide to get you set-up, this section is intended for those new to open source. If you already have the technologies listed in the sub-section titles here, go ahead and skip to <a href="#Running Locally">Running Locally</a> or <a href="#Guildlines">Guildlines</a>. Assumed here is some familiarity with the command line, and a system running a flavor of Unix (Linux or OSX). See [here](windows.md) for Windows instructions.

### Git
The code for the project is hosted on Github. Git is revision control software. You will need to have git installed on your computer, and a Github account. You can attain both these requirements from the instructions on the [Github](https://github.com) website.

### Ruby
Also, you will need ruby >=2.0 installed. If you are running a Unix OS should already have it. You can run `ruby --version` at the command prompt to make sure its installed and a recent enough version. See the [Ruby website](https://www.ruby-lang.org/en/downloads/) if you need to download and install Ruby.

### PostgreSQL
Our backend employs PostgreSQL, which you will need installed and intialized on your computer locally. You can follow these steps to setup PostgresSQL, if you have not used it before on your system:

* Use your package manager to install postgres (e.g. yum or apt-get)
* Switch to the postgres user: `sudo -u postgres -i`
* add yourself as a user: `createuser -s <username>`, where <username> is your local user on your computer
* exit the postgres user using `exit`

### Forking/Cloning
Now that you are set-up, you need to fork the repo and get the code on your computer. Github has good instructions on how to do this generally [here](https://help.github.com/articles/fork-a-repo/), but here is the short version specific to our project:
* Create your own fork of the main repo [here](https://github.com/geh4y8/pdxshelters/fork).
* Go to the terminal on your computer and clone your newly created fork: `git clone https://github.com/your-user-name/pdxshelters.git`, where your-user-name is your Github username. This will create a new directory with all the project files.
* cd into that directory
* Setup the upstream connection to the main repo by: `git remote add upstream https://github.com/geh4y8/pdxshelters.git`


Running Locally
----------------
### Front end

Right now, our front-end and back-end are not connected as we work on getting the back-end built up.

The easiest way to get a local development version of the (currently front-end only) site running is by running a simple server locally. If you are on a *nix environment, you should have python natively installed, so you can just navigate to the parent directory of the repo and run the command: 

`python -m SimpleHTTPServer`

and go to [http://localhost:8000/index.html](http://localhost:8000/index.html) in your browser.

### Back end

Before the first time you run the Rails app locally, you will install the necessary gems, and setup the database. You can do this by cd-ing into the pdxshelters/pdxshelter directory and running these commands:

    gem install bundler
    bundle install
    rake db:create
    rake db:migrate

If you want to see the backend (Rails), navigate to the pdxshelters/pdxshelter directory and run `rails s` and navigate to [http://localhost:3000/](http://localhost:3000/) in your browser to see the app.

Guildlines
-----------

After you have forked, the flow of contributing to this project will look like this:

1. Pick an [issue](https://github.com/geh4y8/pdxshelters/issues)
3. Create your feature branch (`git checkout -b my-new-feature`)
4. Commit your changes (`git commit -am 'Add some feature'`)
5. Push to the branch (`git push origin my-new-feature`)
6. Create a new [Pull Request](https://github.com/geh4y8/pdxshelters/compare) (select compare across forks)

Mention the Issue in the title of the PR e.g. "Fixes Issue #8 all dogs can now go to heaven". If you want to add a feature that is not on the issues list, please discuss this with the other project contributers by creating an issue, we will talk about it in the comments there. It would be a total bummer for you to do a bunch of work on something we don't end up using!

When assigning yourself to an issue, please intend to be actively working on it. Beginners may find the tasks tagged "easier" to be less time intensive for those with less coding experience. That is not to that that they will be easy for everyone, so be patient with yourself.

**In order for a pull request to be accepted, it must be reviewed by a contributor with push permissions (this goes for core devs too). Also, any changes to the code must be accompanied with tests and docs, when applicable.**

Refer to this [style guide](https://github.com/styleguide/ruby) for code style, but generally try to be consistent with what you see in the existing code.