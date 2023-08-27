/*
 * @Author: Your name
 * @Date:   2023-07-03 18:39:02
 * @Last Modified by:   Your name
 * @Last Modified time: 2023-07-05 17:51:24
 * 
 */


$(document).ready(function() {
  // Retrieve item details from URL parameters
  var urlParams = new URLSearchParams(window.location.search);
  var itemName = urlParams.get('name');
  var description = urlParams.get('description');
  var itemType = urlParams.get('type');

  // Convert item type icon to text
  var itemTypeText = getItemTypeText(itemType);

  // Display item details on the page
  $('#item-name').text(itemName);
  $('#description').text(description);
  $('#item-type').text(itemTypeText);

  fetchRelations(itemName);
});

// Function to convert item type icon to text
function getItemTypeText(itemType) {
  if (itemType === '<i class="bi bi-box"></i>') {
    return 'Object';
  } else if (itemType === '<i class="bi bi-basket-fill"></i>') {
    return 'Container';
  }
  return '';
}

// Function to fetch relations for the selected item
function fetchRelations(itemName) {
  $.ajax({
    url: 'https://k2zguvcin7.execute-api.ap-south-1.amazonaws.com/dev/relationitems',
    type: 'GET',
    success: function(response) {
      var allItems = JSON.parse(response.body);

      // Filter the relations for the selected item
      var selectedRelations = allItems.filter(function(item) {
        return item.item_name === itemName;
      });

      // Display the relations in the #relations div
      var relationsDiv = $('#relations');
      relationsDiv.empty();

      selectedRelations.forEach(function(item) {
        var relationText = '';

        // Format item_name with CSS class
        if (item.item_name) {
          relationText += '<span class="relation-item item-name">' + item.item_name + '</span>';
        }

        // Format container_name with CSS class
        if (item.container_name) {
          if (relationText !== '') {
            relationText += ' in ';
          }
          relationText += '<span class="relation-item container-name">' + item.container_name + '</span>';
        }

        // Add relation if available
        if (item.relation) {
          if (relationText !== '') {
            relationText += ' = ';
          }
          relationText += item.relation;
        }

        relationsDiv.append($('<div>').addClass('relation-item').html(relationText));
      });
    },
    error: function() {
      alert('Error loading relations');
    }
  });
}





// submint funtion button 
const submitButton = document.getElementById("submitButton");
const containerSelector = document.getElementById("container_selector");
const objectInfo = document.getElementById("object_info");
const containerInfo = document.getElementById("container_info");

// Add event listener to the submit button
submitButton.addEventListener("click", function () {
  // Retrieve item details from the page
  var itemName = $('#item-name').text();
  // var description = $('#description').text();
  // var itemTypeText = $('#item-type').text();

  // Get the selected container value
  const selectedContainer = containerSelector.value;

  // Display the selected values in the info divs
  if (objectInfo) {
    objectInfo.textContent = "Selected Object: " + itemName;
  }
  containerInfo.textContent = "Selected Container: " + selectedContainer;

  // Create an object with the selected values
  const data = {
    item_name: itemName,
    container_name: selectedContainer
  };

  // Send a POST request to the API endpoint to store the combination
  fetch("https://k2zguvcin7.execute-api.ap-south-1.amazonaws.com/dev/relationitems", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(result => {
      // Handle the response from the API if needed
      // console.log(result);
      // loadItems();
      // Update the selected values in the info divs
      if (objectInfo) {
        objectInfo.textContent = "Selected Object: " + result.item_name;
      }
      containerInfo.textContent = "Selected Container: " + result.container_name;
    
    })
    .catch(error => {
      // Handle any errors that occur during the request
      console.error(error);
    });
});

//
//
//
//
//
//
//
      // for container show in a dropdownbox
function loadContainerItemsInSelectBox() {
  const containerSelector = $('#container_selector');
  const containerInfo = $('#container_info');

  $.ajax({
    url: 'https://k2zguvcin7.execute-api.ap-south-1.amazonaws.com/dev/user?item_type=container',
    type: 'GET',
    success: function(response) {
      const items = JSON.parse(response.body);

      containerSelector.empty(); // Clear the existing options

      items.forEach(function(item) {
        const option = $('<option>').val(item.item_name).text(item.item_name);
        containerSelector.append(option);
      });

      containerSelector.change(function() {
        const selectedItemName = $(this).val();
        const selectedItem = items.find(function(item) {
          return item.item_name === selectedItemName;
        });

        if (selectedItem) {
          containerInfo.html(`
            <p>Name: ${selectedItem.item_name}</p>
            <p>Description: ${selectedItem.description}</p>
            <p>Type: ${selectedItem.item_type}</p>
          `);
        } else {
          containerInfo.empty();
        }
      });
    },
    error: function() {
      alert('Error loading items');
    }
  });
}


    // // for object show in dropdown box 
    // function loadObjectItemsInSelectBox() {
    //   const containerSelector = $('#object_selector');
    //   const containerInfo = $('#object_info');

    //   $.ajax({
    //     url: 'https://k2zguvcin7.execute-api.ap-south-1.amazonaws.com/dev/user?item_type=object',
    //     type: 'GET',
    //     success: function(response) {
    //       const items = JSON.parse(response.body);

    //       containerSelector.empty(); // Clear the existing options

    //       items.forEach(function(item) {
    //         const option = $('<option>').val(item.item_name).text(item.item_name);
    //         containerSelector.append(option);
    //       });

    //       containerSelector.change(function() {
    //         const selectedItemName = $(this).val();
    //         const selectedItem = items.find(function(item) {
    //           return item.item_name === selectedItemName;
    //         });

    //         if (selectedItem) {
    //           containerInfo.html(`
    //             <p>Name: ${selectedItem.item_name}</p>
    //             <p>Description: ${selectedItem.description}</p>
    //             <p>Type: ${selectedItem.item_type}</p>
    //           `);
    //         } else {
    //           containerInfo.empty();
    //         }
    //       });
    //     },
    //     error: function() {
    //       alert('Error loading items');
    //     }
    //   });
    // }

    $(document).ready(function() {
      // loadObjectItemsInSelectBox();
      loadContainerItemsInSelectBox()
      // loadItems();


    });
  