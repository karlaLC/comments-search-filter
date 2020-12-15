angular.module('commentsSearch', [])
    .filter('commentsSearch', function ($filter) {
        return function (arr, searchString) {

            //if no query defined, return complete array
            if (!searchString) {
                return arr;
            }

            //filtered array
            var filteredComments = [];

            //convert search query to lower case
            searchString = searchString.toLowerCase();

            //for date range, in format: <=6/3/2020, >=3/1/2020
            var searchEndDate, searchStartDate;

            if (searchString.includes("<=")) {
                searchEndDate = new Date(searchString.substring(2, 10));
                searchEndDate.setHours(0, 0, 0, 0);
            }
            if (searchString.includes(">=")) {
                searchStartDate = new Date(searchString.substring(14));
                searchStartDate.setHours(0, 0, 0, 0);
            }

            //to be able to search by more than one word, separated by a comma
            var searchTermsArray = [];

            if (searchString.includes(',') && !searchString.includes('<=') ) {
                searchTermsArray = searchString.split(',');
            } else {
                searchTermsArray.push(searchString);
            }

            //loop on all items of array and match with query
            angular.forEach(arr, function (item) {
                //console.log(typeof item.createdDate);

                //to compare item.createdDate vs searchStartDate & searchEndDate, without including time
                var itemCreatedDate = new Date(item.createdDate);
                itemCreatedDate.setHours(0, 0, 0, 0);


                searchTermsArray.forEach(function (searchTerm) {
                    // if query matches item's property, add item to filtered array
                    if (item.userDisplayName.toLowerCase().indexOf(searchTerm) !== -1 ||
                        item.content.toLowerCase().indexOf(searchTerm) !== -1 ||
                        (item.searchTags != null && item.searchTags.toLowerCase().indexOf(searchTerm) !== -1) ||
                        (item.isInternal === true && searchTerm === "internal") ||
                        (item.isInternal !== true && searchTerm === "public") ||
                        $filter('utcToLocal')(item.createdDate, 'M/d/yyyy').indexOf(searchTerm) !== -1 || //filter returns date in this format: 6/2/2020

                        //for date range, in format: <=6/3/2020, >=3/1/2020
                        (searchString.includes("<=") && searchString.includes(">=") &&
                            Date.parse(itemCreatedDate) >= Date.parse(searchStartDate) &&
                            Date.parse(itemCreatedDate) <= Date.parse(searchEndDate)
                        )
                    ) {
                        filteredComments.push(item);
                    }

                });
            });

            return filteredComments;
        };
    });
