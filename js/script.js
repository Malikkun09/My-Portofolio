// Loading screen functionality
        window.addEventListener('load', () => {
            setTimeout(() => {
                const loadingScreen = document.getElementById('loading-screen');
                loadingScreen.classList.add('hidden');
            }, 1500); // Loading screen will be visible for 1.5 seconds
        });

        // Navigation functionality
        document.addEventListener('DOMContentLoaded', () => {
            const navLinks = document.querySelectorAll('.nav-link');
            const sections = document.querySelectorAll('section');
            const menuToggle = document.querySelector('.menu-toggle');
            const navLinksContainer = document.querySelector('.nav-links');
            
            // Profile image toggle
            const profileImg = document.getElementById('profile-img');
            const profileImgSecondary = document.getElementById('profile-img-secondary');
            
            profileImg.addEventListener('click', () => {
                profileImgSecondary.classList.toggle('show');
            });
            
            // Menu toggle for mobile
            menuToggle.addEventListener('click', () => {
                navLinksContainer.classList.toggle('active');
            });
            
            // Navigation functionality
            navLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    
                    // Remove active class from all links and sections
                    navLinks.forEach(l => l.classList.remove('active'));
                    sections.forEach(s => s.classList.remove('active'));
                    
                    // Add active class to clicked link
                    link.classList.add('active');
                    
                    // Show corresponding section
                    const targetId = link.getAttribute('href').substring(1);
                    document.getElementById(targetId).classList.add('active');
                    
                    // Close mobile menu if open
                    navLinksContainer.classList.remove('active');
                });
            });
            
            // Comments functionality
            const commentForm = document.getElementById('comment-form');
            const commentsList = document.getElementById('comments-list');
            const notification = document.getElementById('notification');
            
            // Load comments from localStorage or initialize with empty array
            let comments = JSON.parse(localStorage.getItem('comments')) || [];
            
            // Function to display comments
            function displayComments() {
                commentsList.innerHTML = '';
                
                if (comments.length === 0) {
                    commentsList.innerHTML = '<p class="about-text">Belum ada komentar. Jadilah yang pertama!</p>';
                    return;
                }
                
                comments.forEach(comment => {
                    const commentItem = document.createElement('div');
                    commentItem.className = 'comment-item';
                    
                    const date = new Date(comment.date);
                    const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
                    
                    commentItem.innerHTML = `
                        <div class="comment-header">
                            <span class="comment-author">${comment.name}</span>
                            <span class="comment-date">${formattedDate}</span>
                        </div>
                        <p class="comment-text">${comment.comment}</p>
                    `;
                    
                    commentsList.appendChild(commentItem);
                });
            }
            
            // Display comments on page load
            displayComments();
            
            // Handle comment form submission
            commentForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const name = document.getElementById('name').value;
                const comment = document.getElementById('comment').value;
                
                // Create new comment object
                const newComment = {
                    name: name,
                    comment: comment,
                    date: new Date().toISOString()
                };
                
                // Add comment to array
                comments.unshift(newComment);
                
                // Save to localStorage
                localStorage.setItem('comments', JSON.stringify(comments));
                
                // Display updated comments
                displayComments();
                
                // Reset form
                commentForm.reset();
                
                // Show notification
                notification.textContent = 'Komentar berhasil ditambahkan!';
                notification.classList.add('show');
                
                // Hide notification after 3 seconds
                setTimeout(() => {
                    notification.classList.remove('show');
                }, 3000);
            });
        });