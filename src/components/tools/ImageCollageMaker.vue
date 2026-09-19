<template>
  <div class="image-collage-container">
    <div class="upload-area border border-dashed rounded p-4 text-center mb-4" @click="browseImages" @dragover.prevent @dragleave.prevent @drop.prevent="handleFileDrop">
      <div>
        <i class="fas fa-cloud-upload-alt fa-3x mb-3 text-muted"></i>
        <p class="mb-2">Click to upload images</p>
        <p class="text-small text-muted">or drag & drop images here</p>
        <input type="file" ref="fileInput" multiple accept="image/png,image/jpeg,image/jpg,image/webp,image/bmp,image/tiff,image/x-icon,image/svg+xml" @change="handleFileUpload" style="display: none;">
      </div>
    </div>

    <div class="row">
      <div class="col-md-8 d-flex justify-content-center align-items-center p-1 p-sm-2 p-md-3" ref="canvasContainer">
        <div id="canvas-wrapper" class="border border-secondary rounded position-relative overflow-hidden" ref="canvas" :style="[canvasWrapperStyle, checkerboardStyle]">
          <div class="background-overlay" :style="backgroundOverlayStyle"></div>
          <div v-for="(image, index) in images" :key="image.id" v-show="image.visible" class="collage-item"
               :style="{
                 position: 'absolute',
                 left: image.x + 'px',
                 top: image.y + 'px',
                 width: image.width + 'px',
                 height: image.height + 'px',
                 zIndex: image.zIndex,
                 border: selectedIndex === index ? '2px solid #007bff' : 'none',
                 borderRadius: '4px',
                 cursor: 'move',
                 transform: image.flipped ? 'scaleX(-1)' : ''
               }"
               @mousedown="startDrag($event, index)"
               @touchstart="startDrag($event, index)"
               :class="{ selected: selectedIndex === index }">
            <img :src="image.url" :alt="image.name" class="w-100 h-100" draggable="false"
                 :style="{ opacity: (image.opacity != null ? image.opacity : 100) / 100 }">
            <!-- Resize handles (corners) -->
            <div v-for="handle in resizeHandles" :key="handle" class="resize-handle"
                 :class="'resize-' + handle"
                 @mousedown.stop.prevent="startResize($event, index, handle)"
                 @touchstart.stop.prevent="startResize($event, index, handle)"></div>
          </div>
        </div>
      </div>

      <div class="col-md-4">
        <div class="mb-3">
          <h6>Layers</h6>
          <div class="layer-list">
            <div v-for="(image, index) in reversedImages" :key="image.id" class="layer-item d-flex align-items-start p-2 border rounded mb-2"
                 :class="{ 'bg-light': selectedIndex === getOriginalIndex(index), 'layer-hidden': !image.visible }"
                 @click="selectLayer(getOriginalIndex(index))">
              <div class="flex-shrink-0 me-3">
                <img :src="image.url" :alt="image.name" class="layer-preview" draggable="false"
                     :class="{ 'layer-flipped': image.flipped }"
                     :style="{ opacity: (image.opacity != null ? image.opacity : 100) / 100 }">
              </div>
              <div class="flex-grow-1">
                <div class="layer-name fw-bold" @dblclick="startRename(getOriginalIndex(index))" v-if="editingIndex !== getOriginalIndex(index)">
                  {{ truncateFilename(image.name, 15) }}
                </div>
                <input v-else v-model="editName" @blur="finishRename" @keyup.enter="finishRename"
                       @keyup.esc="cancelRename" @focus="selectEditName"
                       ref="nameInput" class="form-control form-control-sm layer-name-input" />
                <div class="layer-info text-small text-muted">{{ image.width }}×{{ image.height }}px</div>
                <div class="layer-opacity mt-1">
                  <div class="opacity-controls d-flex align-items-center gap-2">
                    <div class="flex-grow-1">
                      <input type="range" class="form-range" min="0" max="100" step="1" v-model.number="image.opacity"
                          @input="updateLayerOpacity(getOriginalIndex(index))">
                    </div>
                    <span class="text-muted text-xs ml-2">{{ image.opacity }}%</span>
                  </div>
                </div>
              </div>
              <div class="layer-controls d-flex flex-column me-2">
                <button class="btn btn-sm btn-outline-secondary mb-1" @click.stop="toggleVisibility(getOriginalIndex(index))"
                        :title="image.visible ? 'Hide layer' : 'Show layer'"
                        :class="{ 'btn-outline-secondary': image.visible, 'btn-outline-warning': !image.visible }">
                  <i :class="image.visible ? 'fas fa-eye' : 'fas fa-eye-slash'"></i>
                </button>
                <button class="btn btn-sm btn-outline-secondary mb-1" @click.stop="flipImage(getOriginalIndex(index))" title="Flip left-right"
                        :class="{ 'active': image.flipped }">
                  <i class="fas fa-arrows-alt-h"></i>
                </button>
                <button class="btn btn-sm btn-outline-secondary" @click.stop="duplicateLayer(getOriginalIndex(index))" title="Duplicate layer">
                  <i class="fas fa-copy"></i>
                </button>
              </div>
              <div class="layer-controls d-flex flex-column">
                <button class="btn btn-sm btn-outline-primary mb-1" @click.stop="moveLayerUp(getOriginalIndex(index))" title="Move up">
                  <i class="fas fa-arrow-up"></i>
                </button>
                <button class="btn btn-sm btn-outline-primary mb-1" @click.stop="moveLayerDown(getOriginalIndex(index))" title="Move down">
                  <i class="fas fa-arrow-down"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" @click.stop="removeLayer(getOriginalIndex(index))" title="Remove">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>
          </div>
          <div v-if="images.length === 0" class="text-center text-muted py-3">
            No images added yet
          </div>
        </div>

        <div class="mb-3">
          <h6>Background</h6>
          <div class="background-config p-3 border rounded bg-white">
            <div class="d-flex align-items-center justify-content-between mb-2">
              <label for="background-color" class="mb-0">Color</label>
              <input id="background-color" type="color" v-model="backgroundColor" class="form-control form-control-color"
                     :style="{ width: '60px', height: '38px', padding: '2px' }">
            </div>
            <div class="d-flex align-items-center justify-content-between">
              <label for="background-opacity" class="mb-0">Opacity</label>
              <div class="d-flex align-items-center flex-grow-1 ms-2 gap-2">
                <input id="background-opacity" type="range" class="form-range flex-grow-1" min="0" max="100" step="1"
                       v-model.number="backgroundOpacity">
                <span class="text-muted text-xs">{{ backgroundOpacity }}%</span>
              </div>
            </div>
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
      editingIndex: -1,
      editName: '',
      isDragging: false,
      dragStartX: 0,
      dragStartY: 0,
      dragImageIndex: -1,
      isResizing: false,
      resizeHandle: '',
      resizeStartWidth: 0,
      resizeStartHeight: 0,
      resizeStartX: 0,
      resizeStartY: 0,
      resizeStartImgX: 0,
      resizeStartImgY: 0,
      // Fixed canvas dimensions - these never change
      canvasWidth: 800,
      canvasHeight: 600,
      // Scale factor for fitting canvas in container
      canvasScale: 1,
      resizeHandles: ['top-left', 'top-right', 'bottom-left', 'bottom-right', 'left', 'right', 'top', 'bottom'],
      // Background settings
      backgroundColor: '#FFFFFF',
      backgroundOpacity: 100
    };
  },
  mounted() {
    this.resizeContainer();
    window.addEventListener('resize', this.resizeContainer);
    document.addEventListener('mousemove', this.performDrag);
    document.addEventListener('mouseup', this.endDrag);
    document.addEventListener('mouseup', this.endResize);
    document.addEventListener('touchmove', this.performDrag);
    document.addEventListener('touchend', this.endDrag);
    document.addEventListener('touchend', this.endResize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeContainer);
    document.removeEventListener('mousemove', this.performDrag);
    document.removeEventListener('mouseup', this.endDrag);
    document.removeEventListener('mouseup', this.endResize);
    document.removeEventListener('touchmove', this.performDrag);
    document.removeEventListener('touchend', this.endDrag);
    document.removeEventListener('touchend', this.endResize);
  },
  computed: {
    reversedImages() {
      return this.images.slice().reverse();
    },
    canvasWrapperStyle() {
      // Apply scale to fit canvas in container while maintaining aspect ratio
      return {
        transform: `scale(${this.canvasScale})`,
        width: `${this.canvasWidth}px`,
        height: `${this.canvasHeight}px`
      };
    },
    checkerboardStyle() {
      return {
        backgroundImage: 'url(/images/assets/transparent-background-small.jpg)',
        backgroundRepeat: 'repeat',
        backgroundSize: 'auto'
      };
    },
    backgroundOverlayStyle() {
      return {
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        backgroundColor: this.backgroundColor,
        opacity: this.backgroundOpacity / 100,
        zIndex: 0,
        pointerEvents: 'none'
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
      const validFiles = Array.from(files).filter(file => 
        file.type.startsWith('image/') && 
        !file.type.includes('gif') && 
        !file.name.toLowerCase().endsWith('.gif')
      );
      validFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            // Auto-fit images larger than canvas while maintaining aspect ratio
            let width = img.width;
            let height = img.height;
            
            const maxWidth = this.canvasWidth;
            const maxHeight = this.canvasHeight;
            
            if (width > maxWidth || height > maxHeight) {
              const ratio = Math.min(maxWidth / width, maxHeight / height) * 0.95;
              width = Math.round(width * ratio);
              height = Math.round(height * ratio);
            }
            
            const newImage = {
              id: Date.now() + Math.random(),
              url: e.target.result,
              name: file.name,
              originalWidth: img.width,
              originalHeight: img.height,
              width: width,
              height: height,
              x: (this.canvasWidth - width) / 2,
              y: (this.canvasHeight - height) / 2,
              zIndex: this.images.length,
              visible: true,
              flipped: false,
              opacity: 100
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
      // Adjust for CSS scale - divide by canvasScale to get actual canvas coordinates
      const scale = this.canvasScale || 1;
      const rectLeft = canvasRect.left / scale;
      const rectTop = canvasRect.top / scale;
      if (event.type === 'touchstart') {
        this.dragStartX = event.touches[0].clientX - rectLeft - this.images[index].x;
        this.dragStartY = event.touches[0].clientY - rectTop - this.images[index].y;
      } else {
        this.dragStartX = event.clientX - rectLeft - this.images[index].x;
        this.dragStartY = event.clientY - rectTop - this.images[index].y;
      }
      this.images[index].zIndex = this.images.length;
    },

    startResize(event, index, handle) {
      this.isResizing = true;
      this.resizeHandle = handle;
      this.resizeImageIndex = index;
      this.selectLayer(index);
      const canvasRect = this.$refs.canvas.getBoundingClientRect();
      // Adjust for CSS scale - divide by canvasScale to get actual canvas coordinates
      const scale = this.canvasScale || 1;
      const rectLeft = canvasRect.left / scale;
      const rectTop = canvasRect.top / scale;
      const clientX = event.type === 'touchstart' ? event.touches[0].clientX : event.clientX;
      const clientY = event.type === 'touchstart' ? event.touches[0].clientY : event.clientY;
      this.resizeStartX = clientX - rectLeft;
      this.resizeStartY = clientY - rectTop;
      this.resizeStartWidth = this.images[index].width;
      this.resizeStartHeight = this.images[index].height;
      this.resizeStartImgX = this.images[index].x;
      this.resizeStartImgY = this.images[index].y;
      this.images[index].zIndex = this.images.length;
    },

    performDrag(event) {
      if (this.isResizing && this.resizeImageIndex !== undefined && this.resizeImageIndex !== -1) {
        event.preventDefault();
        this.performResize(event);
        return;
      }
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
      this.images[this.dragImageIndex].x = newX;
      this.images[this.dragImageIndex].y = newY;
      this.validateVisibility(this.images[this.dragImageIndex]);
    },

    performResize(event) {
      if (!this.isResizing) return;
      const idx = this.resizeImageIndex;
      const img = this.images[idx];
      const canvasRect = this.$refs.canvas.getBoundingClientRect();
      // Adjust for CSS scale - divide by canvasScale to get actual canvas coordinates
      const scale = this.canvasScale || 1;
      const rectLeft = canvasRect.left / scale;
      const rectTop = canvasRect.top / scale;
      const clientX = event.type === 'touchmove' ? event.touches[0].clientX : event.clientX;
      const clientY = event.type === 'touchmove' ? event.touches[0].clientY : event.clientY;
      const cx = clientX - rectLeft;
      const cy = clientY - rectTop;
      const dx = cx - this.resizeStartX;
      const dy = cy - this.resizeStartY;

      const handle = this.resizeHandle;
      let newX = this.resizeStartImgX;
      let newY = this.resizeStartImgY;
      let newWidth = this.resizeStartWidth;
      let newHeight = this.resizeStartHeight;

      // Determine which axis the user is primarily dragging along
      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);
      const dominantAxis = absDx >= absDy ? 'x' : 'y';

      if (handle === 'bottom-right') {
        // Corner - maintain aspect ratio
        const ratio = this.resizeStartHeight / this.resizeStartWidth;
        if (dominantAxis === 'x') {
          newWidth = Math.max(20, this.resizeStartWidth + dx);
          newHeight = Math.max(20, newWidth * ratio);
        } else {
          newHeight = Math.max(20, this.resizeStartHeight + dy);
          newWidth = Math.max(20, newHeight / ratio);
        }
      } else if (handle === 'bottom-left') {
        // Corner - maintain aspect ratio
        // Opposite corner (top-right) stays fixed: top edge and right edge
        const ratio = this.resizeStartHeight / this.resizeStartWidth;
        if (dominantAxis === 'x') {
          newWidth = Math.max(20, this.resizeStartWidth - dx);
          newHeight = Math.max(20, newWidth * ratio);
        } else {
          newHeight = Math.max(20, this.resizeStartHeight + dy);
          newWidth = Math.max(20, newHeight / ratio);
        }
        // Right edge stays fixed
        newX = this.resizeStartImgX + this.resizeStartWidth - newWidth;
        // Top edge stays fixed
        newY = this.resizeStartImgY;
      } else if (handle === 'top-right') {
        // Corner - maintain aspect ratio
        // Opposite corner (bottom-left) stays fixed: left edge and bottom edge
        const ratio = this.resizeStartHeight / this.resizeStartWidth;
        if (dominantAxis === 'x') {
          newWidth = Math.max(20, this.resizeStartWidth + dx);
          newHeight = Math.max(20, newWidth * ratio);
        } else {
          newHeight = Math.max(20, this.resizeStartHeight - dy);
          newWidth = Math.max(20, newHeight / ratio);
        }
        // Left edge stays fixed
        newX = this.resizeStartImgX;
        // Bottom edge stays fixed
        newY = this.resizeStartImgY + this.resizeStartHeight - newHeight;
      } else if (handle === 'top-left') {
        // Corner - maintain aspect ratio
        // Opposite corner (bottom-right) stays fixed: right edge and bottom edge
        const ratio = this.resizeStartHeight / this.resizeStartWidth;
        if (dominantAxis === 'x') {
          newWidth = Math.max(20, this.resizeStartWidth - dx);
          newHeight = Math.max(20, newWidth * ratio);
        } else {
          newHeight = Math.max(20, this.resizeStartHeight - dy);
          newWidth = Math.max(20, newHeight / ratio);
        }
        // Right edge stays fixed
        newX = this.resizeStartImgX + this.resizeStartWidth - newWidth;
        // Bottom edge stays fixed
        newY = this.resizeStartImgY + this.resizeStartHeight - newHeight;
      } else if (handle === 'left') {
        // Side - width only
        newWidth = Math.max(20, this.resizeStartWidth - dx);
        newX = this.resizeStartImgX + dx;
      } else if (handle === 'right') {
        // Side - width only
        newWidth = Math.max(20, this.resizeStartWidth + dx);
      } else if (handle === 'top') {
        // Side - height only
        newHeight = Math.max(20, this.resizeStartHeight - dy);
        newY = this.resizeStartImgY + dy;
      } else if (handle === 'bottom') {
        // Side - height only
        newHeight = Math.max(20, this.resizeStartHeight + dy);
      }

      img.width = newWidth;
      img.height = newHeight;
      img.x = newX;
      img.y = newY;
      this.validateVisibility(img);
    },

    validateVisibility(img) {
      const minVisible = 50;
      // Horizontal: at least 50px must overlap canvas
      const hOverlapStart = Math.max(img.x, 0);
      const hOverlapEnd = Math.min(img.x + img.width, this.canvasWidth);
      const hOverlap = hOverlapEnd - hOverlapStart;
      if (hOverlap < minVisible) {
        if (img.x < 0) {
          img.x = -(img.width - minVisible);
        } else {
          img.x = this.canvasWidth - minVisible;
        }
      }
      // Vertical: at least 50px must overlap canvas
      const vOverlapStart = Math.max(img.y, 0);
      const vOverlapEnd = Math.min(img.y + img.height, this.canvasHeight);
      const vOverlap = vOverlapEnd - vOverlapStart;
      if (vOverlap < minVisible) {
        if (img.y < 0) {
          img.y = -(img.height - minVisible);
        } else {
          img.y = this.canvasHeight - minVisible;
        }
      }
    },

    endDrag() {
      this.isDragging = false;
      this.dragImageIndex = -1;
    },

    endResize() {
      this.isResizing = false;
      this.resizeImageIndex = -1;
      this.resizeHandle = '';
    },

    getOriginalIndex(reversedIndex) {
      return this.images.length - 1 - reversedIndex;
    },

    selectLayer(index) {
      this.selectedIndex = index;
    },

    moveLayerUp(index) {
      if (index >= this.images.length - 1) return;
      const temp = this.images[index];
      this.images.splice(index, 1);
      this.images.splice(index + 1, 0, temp);
      this.updateZIndices();
      this.selectLayer(index + 1);
    },

    moveLayerDown(index) {
      if (index <= 0) return;
      const temp = this.images[index];
      this.images.splice(index, 1);
      this.images.splice(index - 1, 0, temp);
      this.updateZIndices();
      this.selectLayer(index - 1);
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

    startRename(index) {
      this.editingIndex = index;
      this.editName = this.images[index].name;
    },

    finishRename() {
      if (this.editingIndex >= 0 && this.editName.trim()) {
        this.images[this.editingIndex].name = this.editName.trim();
      }
      this.editingIndex = -1;
      this.editName = '';
    },

    cancelRename() {
      this.editingIndex = -1;
      this.editName = '';
    },

    selectEditName() {
      // Select all text in the input when focused for easier editing
      setTimeout(() => {
        const input = this.$refs.nameInput;
        if (input) {
          input.select();
        }
      }, 10);
    },

    updateLayerOpacity(index) {
      let opacity = this.images[index].opacity;
      if (opacity == null || isNaN(opacity)) {
        opacity = 100;
      }
      this.images[index].opacity = Math.max(0, Math.min(100, opacity));
    },

    toggleVisibility(index) {
      this.$set(this.images[index], 'visible', !this.images[index].visible);
    },

    flipImage(index) {
      const img = this.images[index];
      if (img.flipped) {
        // Reset bounds when un-flipping
        img.x = Math.max(0, Math.min(img.x, this.canvasWidth - img.width));
        img.y = Math.max(0, Math.min(img.y, this.canvasHeight - img.height));
      } else {
        // When flipping, adjust position if it would go off canvas
        if (img.x < 0) img.x = 50;
      }
      this.$set(this.images[index], 'flipped', !img.flipped);
    },

    duplicateLayer(index) {
      const original = this.images[index];
      const newImage = {
        id: Date.now() + Math.random(),
        url: original.url,
        name: original.name + ' (copy)',
        originalWidth: original.originalWidth,
        originalHeight: original.originalHeight,
        width: original.width,
        height: original.height,
        x: original.x + 30,
        y: original.y + 30,
        zIndex: this.images.length,
        visible: original.visible,
        flipped: original.flipped,
        opacity: original.opacity
      };
      this.images.push(newImage);
      this.selectLayer(this.images.length - 1);
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

      // Apply background color with opacity
      ctx.globalAlpha = this.backgroundOpacity / 100;
      ctx.fillStyle = this.backgroundColor;
      ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
      ctx.globalAlpha = 1;
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

    resizeContainer() {
      const container = this.$refs.canvasContainer;
      if (container) {
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;
        // Calculate scale to fit canvas while maintaining aspect ratio
        const scaleX = containerWidth / this.canvasWidth;
        const scaleY = containerHeight / this.canvasHeight;
        this.canvasScale = Math.min(scaleX, scaleY, 1); // Don't upscale beyond 100%
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

.layer-item.layer-hidden {
  opacity: 0.3;
}

.layer-item.layer-hidden .layer-preview {
  filter: grayscale(100%) opacity(0.5);
}

.layer-preview {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 3px;
}

.layer-preview.layer-flipped {
  transform: scaleX(-1);
}

.layer-controls .btn.active {
  background-color: #ffc107;
  border-color: #ffc107;
  color: #212529;
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

/* Background configuration box */
.background-config {
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
}

.background-config label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #495057;
}

.background-config .form-control-color {
  border: 1px solid #ced4da;
  border-radius: 4px;
  cursor: pointer;
  padding: 2px;
}

.background-config .form-range {
  height: 6px;
}

.background-config .text-xs {
  font-size: 0.75rem;
  min-width: 35px;
  text-align: right;
}

.controls {
  margin-top: 2rem;
}

/* Resize handles */
.resize-handle {
  position: absolute;
  width: 12px;
  height: 12px;
  background: #007bff;
  border: 2px solid #fff;
  border-radius: 2px;
  z-index: 10;
  display: none;
}

.collage-item:hover .resize-handle,
.collage-item.selected .resize-handle {
  display: block;
}

.resize-handle.resize-top-left {
  top: -6px;
  left: -6px;
  cursor: nwse-resize;
}

.resize-handle.resize-top-right {
  top: -6px;
  right: -6px;
  cursor: nesw-resize;
}

.resize-handle.resize-bottom-left {
  bottom: -6px;
  left: -6px;
  cursor: nesw-resize;
}

.resize-handle.resize-bottom-right {
  bottom: -6px;
  right: -6px;
  cursor: nwse-resize;
}

/* Side handles - for independent width/height resizing */
.resize-handle.resize-left {
  left: -6px;
  top: 50%;
  margin-top: -6px;
  width: 12px;
  height: 12px;
  cursor: ew-resize;
}

.resize-handle.resize-right {
  right: -6px;
  top: 50%;
  margin-top: -6px;
  width: 12px;
  height: 12px;
  cursor: ew-resize;
}

.resize-handle.resize-top {
  top: -6px;
  left: 50%;
  margin-left: -6px;
  width: 12px;
  height: 12px;
  cursor: ns-resize;
}

.resize-handle.resize-bottom {
  bottom: -6px;
  left: 50%;
  margin-left: -6px;
  width: 12px;
  height: 12px;
  cursor: ns-resize;
}
</style>
