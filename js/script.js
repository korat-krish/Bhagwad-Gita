let chdata = document.getElementById('chdata');
let detailModal = document.querySelector('.detail-modal');
let versesModal = document.querySelector('.vermodal-body');
function getData() {
  fetch('https://vedicscriptures.github.io/chapters')
    .then(response => response.json())
    .then(data => {
      let str = "";
      data.forEach(element => {
        str += `
          <div class="col-lg-5 p-2 chapter-name bg-secondary m-2 text-center rounded" style="cursor:pointer !important;" onclick="showdetail(${element.chapter_number})">
            ${element.chapter_number} : ${element.name} (${element.translation})
          </div>
        `;
      });
      chdata.innerHTML = str;
    })
    .catch(err => console.log(err));
}
getData();

function showdetail(chapter_number) {
  fetch('https://vedicscriptures.github.io/chapters')
    .then(response => response.json())
    .then(data => {
      let chapter = data.find(ch => ch.chapter_number === chapter_number);
      if (!chapter) return;
      let str = `
        <div class="modal fade show" id="chapterModal" tabindex="-1" style="display:block; background:rgba(0,0,0,0.6);">
          <div class="modal-dialog modal-dialog-scrollable">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">${chapter.name} (${chapter.meaning.en})</h5>
                <button type="button" class="btn-close" onclick="closeModal()"></button>
              </div>
              <div class="modal-body">
                <h4>Available Verses : ${chapter.verses_count}</h4>
                <p>${chapter.summary.en}</p>
                <p>${chapter.summary.hi}</p>
              </div>
              <div class="modal-footer d-flex justify-content-between">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Close</button>
                <button type="button" class="btn btn-primary" onclick="show_Verses(${chapter.chapter_number},${chapter.verses_count})">View Verses</button>
              </div>
            </div>
          </div>
        </div>
      `;
      detailModal.innerHTML = str;
    })
    .catch(err => console.log(err));
}

function closeModal() {
  detailModal.innerHTML = "";
}

function show_Verses(chapter_number, verses_count) {
  closeModal();

  let verseContainer = document.querySelector('.vermodal-body');
  verseContainer.innerHTML = `<h5 class="text-center text-muted">Loading verses...</h5>`;

  // Open modal before loading verses
  let modalInstance = new bootstrap.Modal(document.getElementById('versesModal'));
  modalInstance.show();

  // Fetch all verses for the selected chapter
  verseContainer.innerHTML = ""; // Clear again before adding content
  for (let j = 1; j <= verses_count; j++) {
    fetch(`https://vedicscriptures.github.io/slok/${chapter_number}/${j}/`)
      .then(response => response.json())
      .then(data => {
        verseContainer.innerHTML += `
          <div class="verse p-3 mb-3 border rounded shadow-sm">
            <h5 class="text-primary">Verse ${data.verse}</h5>
            <p><strong>Sanskrit:</strong> ${data.slok}</p>
            <p><strong>English:</strong> ${data.transliteration}</p>
            <p><strong>Meaning:</strong> ${data.tej.ht}</p>
          </div>
        `;
      })
      .catch(err => console.log(err));
  }
}
