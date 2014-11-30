![PDXShelter logo](img/pdxsheltericon.png "Never doubt that a small group of thoughtful, committed, citizens can change the world. Indeed, it is the only thing that ever has.")

What is PDXShelter?
===================

PDXShelter is a resource for both providers and guests of homeless shelters. Research shows that 70% of homeless youth have access to smartphones. This app allows users to view shelter bed openings near them in real time, and shelters can update their count on the fly. Built to be used on both web and mobile platforms, we hope to help keep a roof over heads to those in need.

See the current demo at [pdxshelter.org](https://www.pdxshelter.org/)

Practically, we are making a web app that uses the [Google maps API](https://developers.google.com/maps/web/), [Firebase](https://www.firebase.com/), and [Ruby on Rails](http://rubyonrails.org/) to allow shelters, or other organizations that provide services, to log in and update their bed availability numbers or information related to hosted events. We are also working on allowing shelters to enter and track information about their guests. The public side of the app will allow homeless people, and those assisting them, to see up-to-date information about shelters, events and other available resources entered into the system.

**The project is still very much in it's early stages of development**, and the current technologies used and our processes are liable to change.

We are currently developing this with the support of the community here in Portland, OR. However, our goal is to implement a model that can be used anywhere in the world.

Features
----------

Here is a list of general things we have and would like the app to achieve, see <a href="#Contributing">Contributing</a> and [issues](https://github.com/geh4y8/pdxshelters/issues) if you want to submit a patch.

A list of the current features we have (at least partly implemented):

* Shelter map points, with basic info
* Real-time shelter bed availablities
* Shelter login and bed-update (demo only)
* Other events offered by non-shelter groups
* Map filtering by shelters, events, meals, and clothing

Features to be implemented:

* Ability to add a new provider
* Ability for providers to login/create user roles (i.e. admin vs employee)
* Ability for providers to create guests
* View for providers to view guest list/profiles
* Ability for providers to create events
* Ability for providers to update public details (e.g. hours amenities)
* Ability for providers to upload TB card detail/image for guests
* An events feed that shows newly added (or soonest occuring?) events
* A better way to filter map results?
* API documentation (Yard?)

(Possible) Future directions:

* Allow guest users to create profiles and make reservations
* Functionality to allow non-shelter homeless users to request assistance, and people to respond with said assistance

Contributing
------------

We want to change the way techology is used to help those in need, come be part of the revolution!

If you want to talk to us directly about collaborating or supporting our work, technically or otherwise, see contacts below.

We welcome everyone who wishes to contribute to the source, regardless of experience level. To facilitate this, we've put together some detailed [instructions](contributing.md) on how to contribute.

Individuals we particularly need at this time are a front-end wizard, and a social media volunteer. Email us if you can help!

Contact
--------

You can follow us on [twitter](http://twitter.com/pdxshelter)!

For general (non-tech) related inquires about our organization -- Our Director, Matthew Fountain : matthewdfountain@gmail.com

To talk to the someone related to the code/developement side of things -- Guy Halperin: guy.halperin88@gmail.com or Amy Boyle: amylou.boyle@gmail.com

License
-------
[MIT](LICENSE.txt)