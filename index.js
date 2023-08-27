/**
 * @Author: Your name
 * @Date:   2023-06-22 20:08:36
 * @Last Modified by:   Your name
 * @Last Modified time: 2023-07-20 17:14:53
 */
// Function to handle item update
// Function to handle item update
function updateItem(event) {
  var userSub = getCognitoUserSub(); // Get the user ID (subject claim) from the Cognito access token
  var updatedItemName = document.getElementById('item_name').value;
  var updatedDescription = document.getElementById('description').value;
  var updatedItemType = document.getElementById('item_type').value;

  // Prepare the request body
  var requestBody = {
    user_id: userSub,
    item_name: updatedItemName,
    description: updatedDescription,
    item_type: updatedItemType
  };

  // Send the PUT request to update the item
  fetch('https://k2zguvcin7.execute-api.ap-south-1.amazonaws.com/dev/user', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  })
  .then(response => {
    if (response.ok) {
      alert('Item updated successfully');
      // Perform any additional actions after successful update
      // Close the modal or update the UI as needed
      $('#editModal').modal('hide');
      // Reload the items
      loadItems();
    } else {
      throw new Error('Error updating item');
    }
  })
  .catch(error => {
    alert('Error updating item: ' + error.message);
  });
}


function getCognitoUserSub() {
  // Assuming you have access to the Cognito access token after user authentication
  // You can extract the user ID (subject claim) from the access token
  // For example, if you are using AWS Amplify for authentication:
  // const user = await Auth.currentAuthenticatedUser();
  // const userSub = user.attributes.sub;

  // For testing purposes, return a hardcoded user ID
  return 'user123';
}


// define the callAPI function that takes an item name, description, and item type as parameters
var callAPI = (itemName, description, itemType) => {
  var userSub = getCognitoUserSub(); // Get the user ID (subject claim) from the Cognito access token

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  // Prepare the request body with the user ID
  var requestBody = JSON.stringify({
    user_id: userSub,
    item_name: itemName,
    description: description,
    item_type: itemType
  });

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: requestBody,
    redirect: 'follow'
  };

  fetch("https://k2zguvcin7.execute-api.ap-south-1.amazonaws.com/dev/user", requestOptions)
    .then(response => response.json())
    .then(result => {
      // Check if the response has statusCode 200
      if (result.statusCode === 200) {
        // Parse the body as JSON and display the items
        var items = JSON.parse(result.body);
        // showAll(items);
        loadItems();
        // Clear the input fields
        document.getElementById('fName').value = '';
        document.getElementById('nName').value = '';
        document.getElementById('iName').value = '';
        // Hide the form
        var form = document.getElementById('addItemForm');
        form.style.display = 'none';
      } else {
        alert("Error: " + result.body);
      }
    })
    .catch(error => console.log('error', error));
};

// disply item
function displayItems(items) {
    var itemTable = $('#item-table');
    itemTable.empty();
   // Sort the items based on add time
    items.sort(function(a, b) {
    var dateA = Date.parse(a.add_time);
    var dateB = Date.parse(b.add_time);
    return dateA - dateB;
  });
  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    var row = $('<tr>').addClass('table-row');
    var itemNameCell = $('<td>').text(item.item_name).addClass('item-name');
    var descriptionCell = $('<td>').text(item.description);
    // var itemTypeCell = $('<td>').text(item.item_type);
    var itemTypeCell = $('<td>').html(getItemIcon(item.item_type));
    var deleteButton = $('<button>').addClass('delete-btn').attr('data-item-name', item.item_name).html('<i class="fa fa-trash"></i>');
    var editButton = $('<button>').addClass('edit-btn').attr('data-toggle', 'modal').attr('data-target', '#editModal').attr('data-item-name', item.item_name).attr('data-item-description', item.description).attr('data-item-type', item.item_type).html('<i class="fa fa-edit"></i>');
    row.append(itemNameCell);
    row.append(descriptionCell);
    row.append(itemTypeCell);
    row.append($('<td>').html(deleteButton));
    row.append($('<td>').html(editButton));
    itemTable.append(row);
  }
    // Add click event listener for delete buttons
    $('.delete-btn').click(function() {
      var itemName = $(this).data('item-name');
      console.log('Deleting item with itemName:', itemName);
      deleteItem(itemName);
    });
    // Add click event listener for edit buttons
    $('.edit-btn').click(function() {
      var itemName = $(this).data('item-name');
      var description = $(this).data('item-description');
      var itemType = $(this).data('item-type');
      console.log('Editing item with itemName:', itemName);
      // Call the setEditModal function passing the item details as parameters
      setEditModal(itemName, description, itemType);
    });
      // Add click event listener for table rows
      $('.item-name').click(function() {
        var itemName = $(this).text();
        var description = $(this).closest('tr').find('td:nth-child(2)').text();
        var itemType = $(this).closest('tr').find('td:nth-child(3)').html();
        navigateToItemDetails(itemName, description, itemType);
      });
      // Function to navigate to item details page with item details as URL parameters
      function navigateToItemDetails(itemName, description, itemType) {
        var url = 'item-details.html?name=' + encodeURIComponent(itemName) +
          '&description=' + encodeURIComponent(description) +
          '&type=' + encodeURIComponent(itemType);
        window.location.href = url;
      }
      
       //Function to get the item icon based on the item type
    function getItemIcon(itemType) {
      if (itemType === 'object') {
        return '<i class="bi bi-box"></i>';
      } else if (itemType === 'container') {
        return '<i class="bi bi-basket-fill"></i>';
      }
      return '';
    }
  }
  
  
    // Add click event listener for edit buttons

  


// Function to load items from DynamoDB
function loadItems() {
    $.ajax({
        url: 'https://k2zguvcin7.execute-api.ap-south-1.amazonaws.com/dev/user',
        type: 'GET',
        success: function(response) {
            displayItems(JSON.parse(response.body));
        },
        error: function() {
            alert('Error loading items');
        }
    });
    }



// edit funtion
// function setEditModal(itemName, description, itemType) {
//     document.getElementById('item_name').value = itemName;
//     document.getElementById('description').value = description;
//     document.getElementById('item_type').value = itemType;
//     document.getElementById('editItemNameLabel').textContent = "Item Name: " + itemName;
  
//     $('#editModal').modal('show');
//     // Add event listener to update button
//     document.getElementById('editForm').addEventListener('click', function() 
//         {
//       // Get the updated values from the form fields
//       var updatedItemName = document.getElementById('item_name').value;
//       var updatedDescription = document.getElementById('description').value;
//       var updatedItemType = document.getElementById('item_type').value;
  
//       // Call the updateItem function with the updated values
//       updateItem(updatedItemName, updatedDescription, updatedItemType);
//     });
//   }

function setEditModal(itemName, description, itemType) {
    document.getElementById('item_name').value = itemName;
    document.getElementById('description').value = description;
    document.getElementById('item_type').value = itemType;
    document.getElementById('editItemNameLabel').textContent = "Item Name: " + itemName;
  
    $('#editModal').modal('show');
  
    // Remove the existing event listener (if any) to avoid multiple listeners
    document.getElementById('editForm').removeEventListener('submit', updateItem);
  
    // Add event listener to the form submit event
    document.getElementById('editForm').addEventListener('submit', function(event) {
      event.preventDefault(); // Prevent the default form submission
      updateItem(event);
    });
  }
// delete item
function deleteItem(itemName) {
  var userSub = getCognitoUserSub(); // Get the user ID (subject claim) from the Cognito access token
  console.log('Received itemName for deletion:', itemName);
  var apiUrl = 'https://k2zguvcin7.execute-api.ap-south-1.amazonaws.com/dev/deleteitem';
  
  var requestBody = {
    user_id: userSub,
    item_name: itemName
    // Add other attributes if required for your schema
  };
  
  // Send the DELETE request
  fetch(apiUrl, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  })
  .then(response => {
    if (response.ok) {
      alert('Item deleted successfully');
      // Perform any additional actions after successful deletion
      // Reload the items
      loadItems();
    } else {
      throw new Error('Error deleting item');
    }
  })
  .catch(error => {
    alert('Error deleting item: ' + error.message);
  });
}
    
      
      
    // function toggleFormVisibility() {
    //     var addItemForm = document.getElementById('addItemForm');
    //     var addItemButton = document.getElementById('addItemButton');
    //     var textField = document.querySelector('.text-field');
              
    //     var lastScrollPosition = window.pageYOffset || document.documentElement.scrollTop;
              
    //     if (addItemForm.style.display === 'none') {
    //       // Smoothly open the form
    //       addItemForm.style.transition = 'height 0.3s ease, opacity 0.3s ease';
    //       addItemForm.style.height = 'auto';
    //       addItemForm.style.opacity = '1';
    //       addItemButton.style.opacity = '0';
              
    //       setTimeout(function() {
    //         addItemForm.style.display = 'block';
    //         addItemButton.style.visibility = 'hidden';
    //       }, 300);
    //     } else {
    //       // Smoothly close the form
    //       addItemForm.style.transition = 'height 0.3s ease, opacity 0.3s ease';
    //       addItemForm.style.height = '0';
    //       addItemForm.style.opacity = '0';
              
    //       setTimeout(function() {
    //         addItemForm.style.display = 'none';
    //         addItemButton.style.visibility = 'visible';
    //         addItemButton.style.opacity = '1';
    //       }, 300);
    //     }
              
    //     function hideForm() {
    //       addItemForm.style.transition = 'height 0.3s ease, opacity 0.3s ease';
    //       addItemForm.style.height = '0';
    //       addItemForm.style.opacity = '0';
              
    //       setTimeout(function() {
    //         addItemForm.style.display = 'none';
    //         addItemButton.style.visibility = 'visible';
    //         addItemButton.style.opacity = '1';
    //       }, 300);
    //     }
              
    //     window.addEventListener('scroll', function() {
    //       var currentScrollPosition = window.pageYOffset || document.documentElement.scrollTop;
              
    //       if (currentScrollPosition < lastScrollPosition) {
    //         // Scrolling up, hide the form
    //         hideForm();
    //       }
              
    //       lastScrollPosition = currentScrollPosition;
    //     });
    //   }
      
//     var toggleFormVisibility = () => {
//     var form = document.getElementById('addItemForm');
//     // Update the form visibility status variable
//     isFormVisible = !isFormVisible;
//     form.style.display = isFormVisible ? 'block' : 'none';
//   };

//   window.addEventListener('scroll', () => {
//     var scrollPosition = window.scrollY;
//     if (scrollPosition === 0 && !isFormVisible) {
//       toggleFormVisibility();
//     }
//   });

var toggleFormVisibility = () => {
    var form = document.getElementById('addItemForm');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
  };
      

      
      
      
      


    
    // Function to filter the table rows based on the search query
// Function to filter the table rows based on the search query
function filterTable() {
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("searchInput");
    filter = input.value.toUpperCase();
    table = document.getElementById("item-table");
    tr = table.getElementsByTagName("tr");

    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[0]; // Change the index to the column you want to search (0 for the first column)
        if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}

// Add event listener to the search input
document.getElementById("searchInput").addEventListener("keyup", filterTable);

// // Add event listener to the search button
// // document.getElementById("searchButton").addEventListener("click", filterTable);
function toggleSearchBox() {
    var searchBox = document.getElementById("searchBox");
    searchBox.classList.toggle("active");
}

// Click event listener for the search button
document.getElementById("toggleSearchButton").addEventListener("click", toggleSearchBox);

// Click event listener for clicking outside the search box to hide it
window.addEventListener("click", function(event) {
    var searchBox = document.getElementById("searchBox");
    var searchButton = document.getElementById("toggleSearchButton");
    if (!searchBox.contains(event.target) && !searchButton.contains(event.target)) {
        searchBox.classList.remove("active");
    }
});

// Add event listener to the search input for filtering the table (same as previous code)
document.getElementById("searchInput").addEventListener("input", filterTable);

// Function to filter the table (same as previous code)


    
$(document).ready(function() {
// Load the items when the page is ready
loadItems();
updateItem();




});
