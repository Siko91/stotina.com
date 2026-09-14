<template>
  <div class="image-collage-container">
    <div class="upload-area border border-dashed rounded p-4 text-center mb-4" @click="browseImages" @dragover.prevent @dragleave.prevent @drop.prevent="handleFileDrop">
      <div>
        <i class="fas fa-cloud-upload-alt fa-3x mb-3 text-muted"></i>
        <p class="mb-2">Click to upload images</p>
        <p class="text-small text-muted">or drag & drop images here</p>
        <input type="file" ref="fileInput" multiple accept="image/*" @change="handleFileUpload" style="display: none;">
      </div>
    </div>

    <div class="row">
      <div class="col-md-8">
        <div id="canvas-wrapper" class="border border-secondary rounded p-3 position-relative bg-light" ref="canvas" :style="{ width: canvasWidth + 'px', height: canvasHeight + 'px' }">
          <div v-for="(image, index) in images" :key="image.id" class="collage-item"
               :style="{
                 position: 'absolute',
                 left: image.x + 'px',
                 top: image.y + 'px',
                 width: image.width + 'px',
                 height: image.height + 'px',
                 zIndex: image.zIndex,
                 border: selectedIndex === index ? '2px solid #007bff' : 'none',
                 borderRadius: '4px',
                 cursor: 'move'
               }"
               @mousedown="startDrag($event, index)"
               @touchstart="startDrag($event, index)"
               :class="{ selected: selectedIndex === index }">
            <img :src="image.url" :alt="image.name" class="w-100 h-100" draggable="false">
          </div>
        </div>
      </div>

      <div class="col-md-4">
        <div class="mb-3">
          <h6>Layers</h6>
          <div class="layer-list">
            <div v-for="(image, index) in images" :key="image.id" class="layer-item d-flex align-items-start p-2 border rounded mb-2"
                 :class="{ 'bg-light': selectedIndex === index }"
                 @click="selectLayer(index)">
              <div class="flex-shrink-0 me-3">
                <img :src="image.url" :alt="image.name" class="layer-preview" draggable="false">
              </div>
              <div class="flex-grow-1">
                <div class="layer-name fw-bold">{{ truncateFilename(image.name, 15) }}</div>
                <div class="layer-info text-small text-muted">{{ image.width }}×{{ image.height }}px</div>
              </div>
              <div class="layer-controls d-flex flex-column">
                <button class="btn btn-sm btn-outline-primary mb-1" @click.stop="moveLayerUp(index)" title="Move up">
                  <i class="fas fa-arrow-up"></i>
                </button>
                <button class="btn btn-sm btn-outline-primary mb-1" @click.stop="moveLayerDown(index)" title="Move down">
                  <i class="fas fa-arrow-down"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" @click.stop="removeLayer(index)" title="Remove">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>
          </div>
          <div v-if="images.length === 0" class="text-center text-muted py-3">
            No images added yet
          </div>
        </div>
      </div>
    </div>

    <div class="controls mt-4 text-center">
      <button id="download-btn" class="btn btn-primary me-2" @click="downloadCollage">
        <i class="fas fa-download me-2"></i> Download Collage
      </button>
      <button class="btn btn-secondary" @click="clearCanvas">
        <i class="fas fa-trash me-2"></i> Clear Canvas
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "ImageCollageMaker",
  data() {
    return {
      images: [],
      selectedIndex: -1,
      isDragging: false,
      dragStartX: 0,
      dragStartY: 0,
      dragImageIndex: -1,
      canvasWidth: 800,
      canvasHeight: 600
    };
  },
  mounted() {
    this.updateCanvasSize();
    window.addEventListener('resize', this.updateCanvasSize);
    document.addEventListener('mousemove', this.performDrag);
    document.addEventListener('mouseup', this.endDrag);
    document.addEventListener('touchmove', this.performDrag);
    document.addEventListener('touchend', this.endDrag);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.updateCanvasSize);
    document.removeEventListener('mousemove', this.performDrag);
    document.removeEventListener('mouseup', this.endDrag);
    document.removeEventListener('touchmove', this.performDrag);
    document.removeEventListener('touchend', this.endDrag);
  },
  computed: {
    canvasStyle() {
      return {
        width: this.canvasWidth + 'px',
        height: this.canvasHeight + 'px'
      };
    }
  },
  methods: {
    browseImages() {
      this.$refs.fileInput.click();
    },

    handleFileUpload(event) {
      const files = event.target.files;
      if (files) {
        this.processFiles(files);
      }
      event.target.value = '';
    },

    handleFileDrop(event) {
      const files = event.dataTransfer.files;
      if (files.length) {
        this.processFiles(files);
      }
    },

    processFiles(files) {
      const validFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
      validFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            let width = img.width;
            let height = img.height;
            const maxSize = 200;
            if (width > maxSize || height > maxSize) {
              const ratio = Math.min(maxSize / width, maxSize / height);
              width = width * ratio;
              height = height * ratio;
            }
            const newImage = {
              id: Date.now() + Math.random(),
              url: e.target.result,
              name: file.name,
              width: width,
              height: height,
              x: (this.canvasWidth - width) / 2,
              y: (this.canvasHeight - height) / 2,
              zIndex: this.images.length
            };
            this.images.push(newImage);
            this.selectLayer(this.images.length - 1);
          };
          img.src = e.target.result;
        };
        reader.readAsDataURL(file);
      });
    },

    startDrag(event, index) {
      this.isDragging = true;
      this.dragImageIndex = index;
      this.selectLayer(index);
      const canvasRect = this.$refs.canvas.getBoundingClientRect();
      if (event.type === 'touchstart') {
        this.dragStartX = event.touches[0].clientX - canvasRect.left - this.images[index].x;
        this.dragStartY = event.touches[0].clientY - canvasRect.top - this.images[index].y;
      } else {
        this.dragStartX = event.clientX - canvasRect.left - this.images[index].x;
        this.dragStartY = event.clientY - canvasRect.top - this.images[index].y;
      }
      this.images[index].zIndex = this.images.length;
    },

    performDrag(event) {
      if (!this.isDragging || this.dragImageIndex === -1) return;
      event.preventDefault();
      const canvasRect = this.$refs.canvas.getBoundingClientRect();
      let newX, newY;
      if (event.type === 'touchmove') {
        newX = event.touches[0].clientX - canvasRect.left - this.dragStartX;
        newY = event.touches[0].clientY - canvasRect.top - this.dragStartY;
      } else {
        newX = event.clientX - canvasRect.left - this.dragStartX;
        newY = event.clientY - canvasRect.top - this.dragStartY;
      }
      newX = Math.max(0, Math.min(newX, this.canvasWidth - this.images[this.dragImageIndex].width));
      newY = Math.max(0, Math.min(newY, this.canvasHeight - this.images[this.dragImageIndex].height));
      this.images[this.dragImageIndex].x = newX;
      this.images[this.dragImageIndex].y = newY;
    },

    endDrag() {
      this.isDragging = false;
      this.dragImageIndex = -1;
    },

    selectLayer(index) {
      this.selectedIndex = index;
    },

    moveLayerUp(index) {
      if (index <= 0) return;
      const temp = this.images[index];
      this.images.splice(index, 1);
      this.images.splice(index - 1, 0, temp);
      this.updateZIndices();
      this.selectLayer(index - 1);
    },

    moveLayerDown(index) {
      if (index >= this.images.length - 1) return;
      const temp = this.images[index];
      this.images.splice(index, 1);
      this.images.splice(index + 1, 0, temp);
      this.updateZIndices();
      this.selectLayer(index + 1);
    },

    removeLayer(index) {
      this.images.splice(index, 1);
      this.updateZIndices();
      if (this.selectedIndex >= this.images.length) {
        this.selectedIndex = this.images.length - 1;
      }
      if (this.selectedIndex < 0 && this.images.length > 0) {
        this.selectedIndex = 0;
      }
    },

    updateZIndices() {
      this.images.forEach((image, index) => {
        image.zIndex = index;
      });
    },

    clearCanvas() {
      if (confirm('Are you sure you want to clear the canvas?')) {
        this.images = [];
        this.selectedIndex = -1;
      }
    },

    downloadCollage() {
      if (this.images.length === 0) {
        alert('Please add some images to the collage first.');
        return;
      }
      const canvas = document.createElement('canvas');
      canvas.width = this.canvasWidth;
      canvas.height = this.canvasHeight;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
      const sortedImages = [...this.images].sort((a, b) => a.zIndex - b.zIndex);
      let loaded = 0;
      sortedImages.forEach(image => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          ctx.drawImage(img, Math.round(image.x), Math.round(image.y), Math.round(image.width), Math.round(image.height));
          loaded++;
          if (loaded === sortedImages.length) {
            canvas.toBlob((blob) => {
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'collage.png';
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              window.URL.revokeObjectURL(url);
            }, 'image/png');
          }
        };
        img.onerror = () => {
          loaded++;
          if (loaded === sortedImages.length) {
            canvas.toBlob((blob) => {
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'collage.png';
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              window.URL.revokeObjectURL(url);
            }, 'image/png');
          }
        };
        img.src = image.url;
      });
    },

    updateCanvasSize() {
      const container = this.$refs.canvas;
      if (container && container.parentElement) {
        const parentWidth = container.parentElement.clientWidth;
        this.canvasWidth = Math.min(parentWidth * 0.85, 1000);
        this.canvasHeight = Math.min(this.canvasWidth * 0.75, 600);
      }
    },

    truncateFilename(filename, maxLength) {
      if (filename.length <= maxLength) return filename;
      return filename.substring(0, maxLength - 3) + '...';
    }
  }
}
</script>

<style scoped>
.image-collage-container {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.upload-area {
  transition: all 0.3s ease;
}

.upload-area:hover {
  border-color: #007bff;
  background-color: rgba(0, 123, 255, 0.05);
}

.layer-item {
  transition: all 0.2s ease;
  border: 1px solid #dee2e6;
}

.layer-item:hover:not(.bg-light) {
  border-color: #007bff;
  background-color: rgba(0, 123, 255, 0.1);
}

.layer-preview {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 3px;
}

.layer-name {
  font-size: 0.9rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.layer-info {
  font-size: 0.75rem;
}

.layer-controls .btn {
  padding: 0.2rem 0.4rem;
  font-size: 0.75rem;
}

.collage-item {
  transition: box-shadow 0.2s ease;
}

.collage-item:hover {
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

#canvas-wrapper {
  touch-action: none;
}

.controls {
  margin-top: 2rem;
}
</style>
