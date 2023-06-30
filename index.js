/**
 * @Author: Your name
 * @Date:   2023-06-22 20:08:36
 * @Last Modified by:   Your name
 * @Last Modified time: 2023-06-30 17:54:46
 */
 // Function to handle item update


 
// Function to handle item update

function updateItem(event) {
    
  var updatedItemName = document.getElementById('item_name').value;
  var updatedDescription = document.getElementById('description').value;
  var updatedItemType = document.getElementById('item_type').value;

  // Prepare the request body
  var requestBody = 
    {
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





/**
 * @Author: Your name
 * @Date:   2023-06-22 20:08:36
 * @Last Modified by:   Your name
 * @Last Modified time: 2023-06-22 20:39:32
 */
// define the callAPI function that takes an item name, description, and item type as parameters
var callAPI = (itemName, description, itemType) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({ "item_name": itemName, "description": description, "item_type": itemType });
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch("https://k2zguvcin7.execute-api.ap-south-1.amazonaws.com/dev/user", requestOptions)
        .then(response => response.json())
        .then(result => {
            // Check if the response has statusCode 200
            if (result.statusCode === 200) {
                // Parse the body as JSON and display the items
                var items = JSON.parse(result.body);
                // alert("Items in DynamoDB: " + JSON.stringify(items));
                // showAll(items);
                loadItems();
            } else {
                alert("Error: " + result.body);
            }
        })
         .catch(error => console.log('error', error));
}
// disply item
function displayItems(items) {
    var itemTable = $('#item-table');
    itemTable.empty();
    
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        var row = $('<tr>').addClass('table-row');
        row.append($('<td>').text(item.item_name));
        row.append($('<td>').text(item.description));
        row.append($('<td>').text(item.item_type));
        row.append($('<td>').html('<button class="delete-btn" data-item-name="' + item.item_name + '"><i class="fa fa-trash"></i></button>'));
        row.append($('<td>').html('<button class="edit-btn" data-toggle="modal" data-target="#editModal" data-item-name="' + item.item_name + '" data-item-description="' + item.description + '" data-item-type="' + item.item_type + '"><i class="fa fa-edit"></i></button>'));
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
        console.log('Received itemName for deletion:', itemName);
        var apiUrl = 'https://k2zguvcin7.execute-api.ap-south-1.amazonaws.com/dev/deleteitem';
        
        var requestBody = {
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
    

    function toggleFormVisibility() {
        var addItemForm = document.getElementById('addItemForm');
        var addItemButton = document.getElementById('addItemButton');
        const textField = document.querySelector('.text-field');
      
        var lastScrollPosition = window.pageYOffset || document.documentElement.scrollTop;
      
        if (addItemForm.style.display === 'none') {
          // Smoothly open the form
          addItemForm.style.transition = 'height 0.3s ease, opacity 0.3s ease';
          addItemForm.style.height = 'auto';
          addItemForm.style.opacity = '1';
          addItemButton.style.opacity = '0';
      
          setTimeout(function() {
            addItemForm.style.display = 'block';
            addItemButton.style.display = 'none';
          }, 300);
        } else {
          // Smoothly close the form
          addItemForm.style.transition = 'height 0.3s ease, opacity 0.3s ease';
          addItemForm.style.height = '0';
          addItemForm.style.opacity = '0';
      
          setTimeout(function() {
            addItemForm.style.display = 'none';
            addItemButton.style.display = 'block';
          }, 300);
        }
      
        window.addEventListener('scroll', function() {
          var currentScrollPosition = window.pageYOffset || document.documentElement.scrollTop;
      
          if (currentScrollPosition < lastScrollPosition) {
            // Scrolling up, hide the form
            addItemForm.style.transition = 'height 0.3s ease, opacity 0.3s ease';
            addItemForm.style.height = '0';
            addItemForm.style.opacity = '0';
      
            setTimeout(function() {
              addItemForm.style.display = 'none';
              addItemButton.style.display = 'block';
              addItemButton.style.opacity = '1';
            }, 300);
          }
      
          lastScrollPosition = currentScrollPosition;
        });
      }
      


    
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

// Add event listener to the search button
document.getElementById("searchButton").addEventListener("click", filterTable);


    
$(document).ready(function() {
// Load the items when the page is ready
loadItems();




});
